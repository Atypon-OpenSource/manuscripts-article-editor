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
import {
  ICreateDocResponse,
  IGetDocumentResponse,
  ManuscriptDoc,
} from '@manuscripts/quarterback-types'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import Api from '../postgres-data/Api'

interface CurrentDocument {
  manuscriptID: string
  projectID: string
}
interface DocState {
  currentDocument: CurrentDocument | null
  quarterbackDoc: ManuscriptDoc | null
}

export const useDocStore = (api: Api) =>
  create(
    combine(
      {
        currentDocument: null,
        quarterbackDoc: null,
      } as DocState,
      (set) => ({
        setCurrentDocument: (manuscriptID: string, projectID: string) => {
          set({ currentDocument: { manuscriptID, projectID } })
        },
        getDocument: async (projectID: string, manuscriptID: string) => {
          const resp = await api.get<IGetDocumentResponse>(
            `doc/${projectID}/manuscript/${manuscriptID}`
          )
          if (resp) {
            set({ quarterbackDoc: resp })
          }
          return resp
        },
        createDocument: async (manuscriptID: string, projectID: string) => {
          const resp = await api.post<ICreateDocResponse>(
            `doc/${projectID}/manuscript/${manuscriptID}`,
            {
              manuscript_model_id: manuscriptID,
              project_model_id: projectID,
              doc: {},
            }
          )

          if (resp) {
            set({
              currentDocument: { manuscriptID, projectID },
              quarterbackDoc: resp,
            })
          }
          return resp
        },
        updateDocument: async (
          projectID: string,
          manuscriptID: string,
          doc: Record<string, any>
        ) => {
          const resp = await api.put<boolean>(
            `doc/${projectID}/manuscript/${manuscriptID}`,
            { doc }
          )
          if (resp) {
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
        deleteDocument: async (projectID: string, manuscriptID: string) => {
          const resp = await api.delete<boolean>(
            `doc/${projectID}/manuscript/${manuscriptID}`
          )
          if (resp) {
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
