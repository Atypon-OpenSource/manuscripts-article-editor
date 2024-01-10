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
import { Model } from '@manuscripts/json-schema'
import { usePermissions } from '@manuscripts/style-guide'
import { trackCommands } from '@manuscripts/track-changes-plugin'
import { ContainedModel, encode, ManuscriptNode } from '@manuscripts/transform'
import isEqual from 'lodash-es/isEqual'
import { EditorView } from 'prosemirror-view'

import { post } from '../quarterback/api/methods'
import { getDocWithoutTrackContent } from '../quarterback/getDocWithoutTrackContent'
import { ISaveSnapshotResponse } from '../quarterback/types'
import { useStore } from '../store'

export type Ok<T> = {
  data: T
}
export type Error = {
  err: string
  code: number
}
export type Maybe<T> = Ok<T> | Error

const EXCLUDED_KEYS = [
  'id',
  '_id',
  '_rev',
  '_revisions',
  'sessionID',
  'createdAt',
  'updatedAt',
  'owners',
  'manuscriptID',
  'containerID',
  'src',
  'minWordCountRequirement',
  'maxWordCountRequirement',
  'minCharacterCountRequirement',
  'maxCharacterCountRequirement',
] as (keyof Model)[]

const hasChanged = (a: Model, b: Model): boolean => {
  return !!Object.keys(a).find((key: keyof Model) => {
    if (EXCLUDED_KEYS.includes(key)) {
      return false
    }
    return !isEqual(a[key], b[key])
  })
}

const saveDoc = async (
  doc: ManuscriptNode,
  modelMap: Map<string, Model>,
  bulkUpdate: (models: ContainedModel[]) => Promise<void>
): Promise<Maybe<boolean>> => {
  if (!modelMap) {
    return {
      err: 'modelMap undefined inside usePouchStore',
      code: 500,
    }
  }
  const models = encode(doc)

  const newModelMap = new Map()
  for (const model of models.values()) {
    const oldModel = modelMap.get(model._id)

    if (!oldModel) {
      newModelMap.set(model._id, model)
    } else if (hasChanged(model, oldModel)) {
      const nextModel = {
        ...oldModel,
        ...model,
      }
      newModelMap.set(nextModel._id, nextModel)
    }
  }
  try {
    await bulkUpdate([...newModelMap.values()])
    return { data: true }
  } catch (e) {
    return { err: `Failed to save model: ${e}`, code: 500 }
  }
}

export const useHandleSnapshot = (view?: EditorView) => {
  const [
    { projectID, manuscriptID, modelMap, bulkUpdate, authToken, snapshotsMap },
    dispatch,
  ] = useStore((store) => ({
    projectID: store.projectID,
    manuscriptID: store.manuscriptID,
    authToken: store.authToken,
    snapshotsMap: store.snapshotsMap,
    modelMap: store.modelMap,
    bulkUpdate: store.bulkUpdate,
  }))
  const can = usePermissions()
  const canApplySaveChanges = can.applySaveChanges

  const saveSnapshot = async (projectID: string, manuscriptID: string) => {
    const resp = await post<ISaveSnapshotResponse>(
      `snapshot/${projectID}/manuscript/${manuscriptID}`,
      authToken,
      {
        docID: manuscriptID,
        name: new Date().toLocaleString('sv'),
      }
    )

    if ('data' in resp) {
      const { snapshot } = resp.data
      dispatch({
        snapshotsMap: snapshotsMap.set(snapshot.id, snapshot),
      })
    }
    return resp
  }

  return async () => {
    const resp = await saveSnapshot(projectID, manuscriptID)
    if (resp && view) {
      trackCommands.applyAndRemoveChanges()(view.state, view.dispatch)
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const state = view.state
          if (!state) {
            reject(new Error('State is not available'))
            return
          }
          if (!canApplySaveChanges) {
            return resolve()
          }

          saveDoc(getDocWithoutTrackContent(state), modelMap, bulkUpdate)
            .then(() => {
              resolve()
            })
            .catch(() =>
              reject(new Error('Cannot save to api. Check connection.'))
            )
        }, 900) // to avoid potentially saving before the changes are applied
      })
    }
  }
}
