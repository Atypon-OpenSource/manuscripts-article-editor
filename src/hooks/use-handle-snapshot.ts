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
import { usePermissions } from '@manuscripts/style-guide'
import { trackCommands } from '@manuscripts/track-changes-plugin'
import { EditorView } from 'prosemirror-view'

import { saveDoc } from '../postgres-data/savingUtilities'
import { post } from '../quarterback/api/methods'
import { getDocWithoutTrackContent } from '../quarterback/getDocWithoutTrackContent'
import { ISaveSnapshotResponse } from '../quarterback/types'
import { useStore } from '../store'
import { useExecCmd } from './use-track-attrs-popper'

export const useHandleSnapshot = (view?: EditorView) => {
  const [
    {
      projectID,
      manuscriptID,
      modelMap,
      bulkUpdate,
      authToken,
      snapshots,
      snapshotsMap,
      beforeUnload,
    },
    dispatch,
  ] = useStore((store) => ({
    projectID: store.projectID,
    manuscriptID: store.manuscriptID,
    authToken: store.authToken,
    snapshots: store.snapshots,
    snapshotsMap: store.snapshotsMap,
    modelMap: store.modelMap,
    bulkUpdate: store.bulkUpdate,
    beforeUnload: store.beforeUnload,
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
      const { snapshot, ...label } = resp.data.snapshot
      dispatch({
        snapshots: [...snapshots, label],
        snapshotsMap: snapshotsMap.set(label.id, resp.data.snapshot),
      })
    }
    return resp
  }

  const execCmd = useExecCmd()

  return async () => {
    // if there is a pending throttle or potentially other pending action, we need to make sure it's done before we proceed wrapping the current step
    beforeUnload && beforeUnload()
    const resp = await saveSnapshot(projectID, manuscriptID)
    if (resp && view) {
      execCmd(trackCommands.applyAndRemoveChanges(), view)
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
