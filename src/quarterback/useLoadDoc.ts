/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */

import { ManuscriptNode, schema } from '@manuscripts/transform'

import { updateDocument } from './api/document'
import * as docApi from './api/document'
import { SnapshotLabel } from './types'

export const useLoadDoc = (authToken: string) => {
  return async function loadDoc(
    manuscriptID: string,
    projectID: string,
    existingDoc: ManuscriptNode
  ) {
    const found = await docApi.getDocument(projectID, manuscriptID, authToken)
    let doc
    let version = 0
    let snapshots: SnapshotLabel[] = []
    if ('data' in found) {
      let empty = true
      for (const _ in found.data.doc as object) {
        empty = false
        break
      }

      if (empty) {
        await updateDocument(projectID, manuscriptID, authToken, {
          doc: existingDoc.toJSON(),
        })
      }

      snapshots = found.data.snapshots
      doc = found.data.doc
      version = found.data.version
    } else if ('err' in found && found.code === 404) {
      // Create an empty doc that will be replaced with whatever document is currently being edited
      const res = await docApi.createDocument(
        {
          manuscript_model_id: manuscriptID,
          project_model_id: projectID,
          doc: {},
        },
        authToken
      )
      if ('data' in res) {
        doc = res.data.doc
        version = res.data.version
        snapshots = res.data.snapshots
      }
      if ('err' in res) {
        console.error('Unable to create new document: ' + res.err)
      }

      const update = await updateDocument(projectID, manuscriptID, authToken, {
        doc: existingDoc.toJSON(),
      })
      if ('err' in update) {
        console.error('Unable to create new document: ' + update.err)
      } else {
        const found = await docApi.getDocument(
          projectID,
          manuscriptID,
          authToken
        )
        if ('data' in found && found.data.doc && found.data.version >= 0) {
          doc = found.data.doc
          version = found.data.version
        }
      }
    }
    if (
      doc !== null &&
      typeof doc === 'object' &&
      Object.keys(doc).length !== 0
    ) {
      return { doc: schema.nodeFromJSON(doc), version, snapshots }
    }
    return undefined
  }
}
