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

import { useEditorStore } from '../components/track-changes/useEditorStore'
import { getDocWithoutTrackContent } from '../quarterback/getDocWithoutTrackContent'
import { usePouchStore } from '../quarterback/usePouchStore'
import { useSnapshotStore } from '../quarterback/useSnapshotStore'

export const useHandleSnapshot = (storeExists = true) => {
  const { execCmd, docToJSON } = useEditorStore()
  const { saveSnapshot } = useSnapshotStore()
  const can = usePermissions()

  if (!storeExists) {
    return null
  }

  return async () => {
    const resp = await saveSnapshot(docToJSON())
    if ('data' in resp) {
      execCmd(trackCommands.applyAndRemoveChanges())
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const state = useEditorStore.getState().editorState
          if (!state) {
            reject(new Error('State is not available'))
            return
          }
          if (!can.applySaveChanges) {
            return resolve()
          }
          usePouchStore
            .getState()
            .saveDoc(getDocWithoutTrackContent(state))
            .then(() => {
              resolve()
            })
            .catch(() =>
              reject(new Error('Cannot save to api. Check connection.'))
            )
        }, 1000) // to avoid potentially saving before the changes are applied
      })
    }
  }
}
