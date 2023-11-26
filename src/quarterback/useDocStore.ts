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
import { ManuscriptDoc } from '@manuscripts/quarterback-types'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import * as docApi from './api/document'

interface CurrentDocument {
  manuscriptID: string
  projectID: string
}
interface DocState {
  currentDocument: CurrentDocument | null
  quarterbackDoc: ManuscriptDoc | null
}

export const useDocStore = create(
  combine(
    {
      currentDocument: null,
      quarterbackDoc: null,
    } as DocState,
    (set, get) => ({
      setCurrentDocument: (manuscriptID: string, projectID: string) => {
        set({ currentDocument: { manuscriptID, projectID } })
      },
      getDocument: async (
        projectID: string,
        manuscriptID: string,
        authToken: string
      ) => {
        const resp = await docApi.getDocument(
          projectID,
          manuscriptID,
          authToken
        )
        if ('data' in resp) {
          set({ quarterbackDoc: resp.data })
        }
        return resp
      },
      createDocument: async (
        manuscriptID: string,
        projectID: string,
        authToken: string
      ) => {
        const resp = await docApi.createDocument(
          {
            manuscript_model_id: manuscriptID,
            project_model_id: projectID,
            doc: {},
          },
          authToken
        )
        if ('data' in resp) {
          set({
            currentDocument: { manuscriptID, projectID },
            quarterbackDoc: resp.data,
          })
        }
        return resp
      },
      updateDocument: async (
        projectID: string,
        manuscriptID: string,
        doc: Record<string, any>,
        authToken: string
      ) => {
        const resp = await docApi.updateDocument(
          projectID,
          manuscriptID,
          authToken,
          {
            doc,
          }
        )
        if ('data' in resp) {
          set((state) => {
            const { quarterbackDoc } = state
            if (quarterbackDoc) {
              return {
                quarterbackDoc: {
                  ...quarterbackDoc,
                  doc,
                },
              }
            }
            return state
          })
        }
        return resp
      },
      deleteDocument: async (
        projectID: string,
        manuscriptID: string,
        authToken: string
      ) => {
        const resp = await docApi.deleteDocument(
          projectID,
          manuscriptID,
          authToken
        )
        if ('data' in resp) {
          set((state) =>
            state.quarterbackDoc?.manuscript_model_id === manuscriptID
              ? { quarterbackDoc: null }
              : state
          )
        }
        return resp
      },
    })
  )
)
