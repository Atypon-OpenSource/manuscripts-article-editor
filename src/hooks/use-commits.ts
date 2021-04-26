/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { useEditor } from '@manuscripts/manuscript-editor'
import {
  buildContribution,
  ContainedModel,
  getModelsByType,
  ManuscriptNode,
} from '@manuscripts/manuscript-transform'
import {
  Correction,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import {
  checkout,
  commands,
  Commit,
  commitToJSON,
  findCommitWithChanges,
  findCommitWithin,
  getChangeSummary,
  getTrackPluginState,
  rebases,
} from '@manuscripts/track-changes'
import { useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'

import sessionId from '../lib/session-id'
import collectionManager from '../sync/CollectionManager'

const buildCorrection = (
  data: Omit<
    Correction,
    '_id' | 'createdAt' | 'updatedAt' | 'sessionID' | 'objectType' | 'status'
  >
): Correction => ({
  _id: `MPCorrection:${uuid()}`,
  createdAt: Date.now() / 1000,
  updatedAt: Date.now() / 1000,
  sessionID: sessionId,
  objectType: ObjectTypes.Correction,
  status: 'proposed',
  ...data,
})

const correctionsByDate = (a: Correction, b: Correction) =>
  b.contributions![0].timestamp - a.contributions![0].timestamp

const correctionsByContext = (a: Correction, b: Correction) =>
  a.positionInSnapshot! - b.positionInSnapshot!

interface Args {
  modelMap: Map<string, Model>
  ancestorDoc: ManuscriptNode
  initialCommits: Commit[]
  editor: ReturnType<typeof useEditor>
  containerID: string
  manuscriptID: string
  snapshotID: string
  userProfileID: string
  sortBy: string
}

export const useCommits = ({
  modelMap,
  initialCommits,
  editor,
  containerID,
  manuscriptID,
  snapshotID,
  userProfileID,
  ancestorDoc,
  sortBy,
}: Args) => {
  const collection = collectionManager.getCollection<ContainedModel>(
    `project-${containerID}`
  )

  const [commits, setCommits] = useState<Commit[]>(initialCommits)
  const [corrections, setCorrections] = useState<Correction[]>(
    (getModelsByType(modelMap, ObjectTypes.Correction) as Correction[]).filter(
      (corr) => corr.snapshotID === snapshotID
    )
  )
  const { commit: currentCommit } = getTrackPluginState(editor.state)

  const saveCommit = useCallback(
    (commit: Commit) => {
      setCommits((last) => [...last, commit])
      collection.save(commitToJSON(commit, containerID))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerID]
  )

  const saveCorrection = (correction: Correction) => {
    setCorrections((last) => [
      ...last.filter((corr) => corr._id !== correction._id),
      correction,
    ])
    collection.save(correction)
  }

  const freeze = () => {
    const { commit } = getTrackPluginState(editor.state)
    const changeSummary = getChangeSummary(editor.state, commit.changeID)

    saveCommit(commit)

    const correction = buildCorrection({
      contributions: [buildContribution(userProfileID)],
      commitChangeID: currentCommit.changeID,
      containerID,
      manuscriptID,
      snapshotID,
      insertion: changeSummary ? changeSummary.insertion : '',
      deletion: changeSummary ? changeSummary.deletion : '',
      positionInSnapshot: changeSummary ? changeSummary.ancestorPos : undefined,
    })
    saveCorrection(correction)

    editor.doCommand(commands.freezeCommit())
  }

  const unreject = (correction: Correction) => {
    const unrejectedCorrections = corrections
      .filter((cor) => cor._id === correction._id || cor.status !== 'rejected')
      .map((cor) => cor.commitChangeID || '')

    const existingCommit = findCommitWithChanges(commits, unrejectedCorrections)
    if (existingCommit) {
      editor.replaceState(checkout(ancestorDoc, editor.state, existingCommit))
      return
    }

    // TODO: is there some way to find the most optimal instance? The first
    // one created should be the one that was never rebased?
    const pickInstances = (commits
      .map((commit) => findCommitWithin(commit)(correction.commitChangeID!))
      .filter(Boolean) as Commit[]).sort((a, b) => a.updatedAt! - b.updatedAt!)
    if (!pickInstances.length) {
      return
    }

    const { commit: nextCommit, mapping } = rebases.cherryPick(
      pickInstances[0],
      currentCommit
    )

    saveCommit(nextCommit)
    editor.replaceState(
      checkout(ancestorDoc, editor.state, nextCommit, mapping)
    )
  }

  const accept = (correctionID: string) => {
    const current = corrections.find((corr) => corr._id === correctionID)
    if (!current) {
      return
    }

    const { status } = current

    if (status === 'rejected') {
      unreject(current)
    }

    saveCorrection({
      ...current,
      status: status === 'accepted' ? 'proposed' : 'accepted',
      updatedAt: Date.now() / 1000,
    })
  }

  const reject = (correctionID: string) => {
    const current = corrections.find((corr) => corr._id === correctionID)
    if (!current || !current.commitChangeID) {
      return
    }
    const { status } = current

    if (status === 'rejected') {
      saveCorrection({
        ...current,
        status: 'proposed',
        updatedAt: Date.now() / 1000,
      })
      return unreject(current)
    }

    saveCorrection({
      ...current,
      status: 'rejected',
      updatedAt: Date.now() / 1000,
    })

    const unrejectedCorrections = corrections
      .filter((cor) => cor.status !== 'rejected' && cor._id !== correctionID)
      .map((cor) => cor.commitChangeID || '')

    const existingCommit = findCommitWithChanges(commits, unrejectedCorrections)
    if (existingCommit) {
      editor.replaceState(checkout(ancestorDoc, editor.state, existingCommit))
      return
    }

    const commitToRemove = findCommitWithin(currentCommit)(
      current.commitChangeID
    )
    if (!commitToRemove) {
      // safely return early because the commit is not in the current list
      return
    }

    const { commit: nextCommit, mapping } = rebases.without(currentCommit, [
      commitToRemove.changeID,
    ])
    if (!nextCommit) {
      return
    }

    saveCommit(nextCommit)
    editor.replaceState(
      checkout(ancestorDoc, editor.state, nextCommit, mapping)
    )
  }

  return {
    commits,
    corrections: corrections
      .slice()
      .sort(sortBy === 'Date' ? correctionsByDate : correctionsByContext),
    freeze,
    accept,
    reject,
  }
}
