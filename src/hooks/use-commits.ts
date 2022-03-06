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
  findCommitWithChanges,
  findCommitWithin,
  getChangeSummary,
  getTrackPluginState,
  isCommitContiguousWithSelection,
  rebases,
  reset as resetToLastCommit,
} from '@manuscripts/track-changes'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { saveEditorState } from '../lib/bootstrap-manuscript'
import sessionId from '../lib/session-id'
import { useStore } from '../store'
import { useUnmountEffect } from './use-unmount-effect'
import { useWindowUnloadEffect } from './use-window-unload-effect'

const buildCorrection = (
  data: Omit<
    Correction,
    '_id' | 'createdAt' | 'updatedAt' | 'sessionID' | 'objectType'
  >
): Correction => ({
  _id: `MPCorrection:${uuid()}`,
  createdAt: Date.now() / 1000,
  updatedAt: Date.now() / 1000,
  sessionID: sessionId,
  objectType: ObjectTypes.Correction,
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

// TODO: Refactor to use useMicrostore
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
  const [handlers] = useStore((store) => {
    return {
      saveCommitToDb: store.saveCommit,
      saveCorrectionToDb: store.saveCorrection,
    }
  })

  const { saveCommitToDb, saveCorrectionToDb } = handlers

  const [lastSave, setLastSave] = useState<number>(Date.now())
  const timeSinceLastSave = useCallback(() => Date.now() - lastSave, [lastSave])

  const [commits, setCommits] = useState<Commit[]>(initialCommits)
  const [corrections, setCorrections] = useState<Correction[]>(
    (getModelsByType(modelMap, ObjectTypes.Correction) as Correction[]).filter(
      (corr) => corr.snapshotID === snapshotID
    )
  )
  const { commit: currentCommit } = getTrackPluginState(editor.state)
  const [isDirty, setIsDirty] = useState(false)

  const saveCommit = (commit: Commit) => {
    setCommits((last) => [...last, commit])
    return saveCommitToDb(commit)
  }

  const saveCorrection = (correction: Correction) => {
    setCorrections((last) => [
      ...last.filter((corr) => corr._id !== correction._id),
      correction,
    ])
    return saveCorrectionToDb(correction)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const freeze = async (asAccepted?: boolean) => {
    const { commit } = getTrackPluginState(editor.state)
    if (!commit.steps.length) {
      return
    }
    const changeSummary = getChangeSummary(editor.state, commit.changeID)
    if (
      !changeSummary ||
      (changeSummary.deletion.length === 0 &&
        changeSummary.insertion.length === 0)
    ) {
      return
    }

    setIsDirty(true)
    saveEditorState(editor.state, modelMap, containerID, manuscriptID)
    editor.doCommand(commands.freezeCommit())
    setLastSave(Date.now())

    const correction = buildCorrection({
      contributions: [buildContribution(userProfileID)],
      commitChangeID: commit.changeID,
      containerID,
      manuscriptID,
      snapshotID,
      insertion: changeSummary ? changeSummary.insertion : '',
      deletion: changeSummary ? changeSummary.deletion : '',
      positionInSnapshot: changeSummary ? changeSummary.ancestorPos : undefined,
      status: {
        label: asAccepted ? 'accepted' : 'proposed',
        editorProfileID: userProfileID,
      },
    })
    return Promise.all([
      saveCommit(commit),
      saveCorrection(correction),
    ]).finally(() => setIsDirty(false))
  }

  // Freeze the commit when 10 s has passed since the last save AND
  // the cursor is not contiguous with any part of the current commit
  useEffect(() => {
    if (
      timeSinceLastSave() > 10000 &&
      !isCommitContiguousWithSelection(editor.state)
    ) {
      freeze()
    }
  }, [editor.state, freeze, timeSinceLastSave])

  useUnmountEffect(freeze)
  useWindowUnloadEffect(freeze, !!currentCommit.steps.length)

  const unreject = (correction: Correction) => {
    const unrejectedCorrections = corrections
      .filter(
        (cor) => cor._id === correction._id || cor.status.label !== 'rejected'
      )
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

  const findOneCorrection = (
    correction: string | ((corr: Correction) => boolean)
  ) => {
    return typeof correction === 'function'
      ? corrections.find(correction)
      : corrections.find((corr) => corr._id === correction)
  }

  const accept = (correction: string | ((corr: Correction) => boolean)) => {
    const current = findOneCorrection(correction)
    if (!current) {
      return freeze(true)
    }

    const { status } = current

    if (status.label === 'rejected') {
      unreject(current)
    }

    saveCorrection({
      ...current,
      status: {
        label: status.label === 'accepted' ? 'proposed' : 'accepted',
        editorProfileID: userProfileID,
      },
      updatedAt: Date.now() / 1000,
    })
  }

  const reject = (correction: string | ((corr: Correction) => boolean)) => {
    const current = findOneCorrection(correction)
    if (!current) {
      return editor.replaceState(resetToLastCommit(ancestorDoc, editor.state))
    }
    const { status } = current

    if (status.label === 'rejected') {
      saveCorrection({
        ...current,
        status: { label: 'proposed', editorProfileID: userProfileID },
        updatedAt: Date.now() / 1000,
      })
      return unreject(current)
    }

    saveCorrection({
      ...current,
      status: { label: 'rejected', editorProfileID: userProfileID },
      updatedAt: Date.now() / 1000,
    })

    const unrejectedCorrections = corrections
      .filter(
        (cor) => cor.status.label !== 'rejected' && cor._id !== current._id
      )
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
    isDirty,
    corrections: corrections
      .slice()
      .sort(sortBy === 'Date' ? correctionsByDate : correctionsByContext),
    accept,
    reject,
    commitHash: currentCommit._id,
  }
}
