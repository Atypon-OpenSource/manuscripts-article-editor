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

import {
  ContainedModel,
  getModelsByType,
  schema,
} from '@manuscripts/manuscript-transform'
import {
  Commit as CommitJson,
  Correction,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import {
  Commit,
  commitFromJSON,
  commitToJSON,
  findCommitWithChanges,
} from '@manuscripts/track-changes'
import { useCallback, useEffect, useMemo, useState } from 'react'

import collectionManager from '../sync/CollectionManager'

export const useCommits = (
  modelMap: Map<string, Model>,
  containerID: string,
  snapshotID: string
) => {
  const collection = collectionManager.getCollection<ContainedModel>(
    `project-${containerID}`
  )

  const corrections = (getModelsByType(
    modelMap,
    ObjectTypes.Correction
  ) as Correction[]).filter((corr) => corr.snapshotID === snapshotID)

  const unrejectedCorrections = corrections
    .filter((cor) => cor.status !== 'rejected')
    .map((cor) => cor.commitChangeID || '')

  const [commits, setCommits] = useState<Commit[]>([])
  const [load, setLoad] = useState(0)

  const commitAtLoad: Commit | null = useMemo(() => {
    return findCommitWithChanges(commits, unrejectedCorrections) || null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load])

  useEffect(() => {
    collection
      .find({
        $and: [{ containerID }, { objectType: ObjectTypes.Commit }],
      })
      .exec()
      .then((docs) => {
        const commits = docs.map((doc) => {
          const json = (doc.toJSON() as unknown) as CommitJson
          return commitFromJSON(json, schema)
        })
        setCommits(commits)
        setLoad(2)
      })
      .catch((e) => {
        console.error(e, 'ErrorLoadingCommits')
        setLoad(-1)
      })
  }, [collection, containerID])

  const saveCommit = useCallback(
    (commit: Commit) => {
      setCommits((last) => [...last, commit])
      collection.save(commitToJSON(commit, containerID))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerID]
  )

  return {
    load,
    corrections,
    commits,
    commitAtLoad,
    saveCommit,
  }
}
