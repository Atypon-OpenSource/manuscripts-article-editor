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
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import Api from '../postgres-data/Api'

export type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray
  | null

type JsonObject = { [Key in string]?: JsonValue }

type JsonArray = Array<JsonValue>

export type ManuscriptSnapshot = {
  id: string
  name: string
  snapshot: JsonValue
  createdAt: Date
  doc_id: string
}

export type IGetSnapshotResponse = ManuscriptSnapshot

export type SnapshotLabel = Pick<
  ManuscriptSnapshot,
  'id' | 'name' | 'createdAt'
>

// POST /snapshot
export interface ISaveSnapshotRequest {
  docId: string
  name: string
  snapshot: Record<string, any>
}
export interface ISaveSnapshotResponse {
  snapshot: ManuscriptSnapshot
}

export type IUpdateSnapshotRequest = {
  name?: string
}

interface SnapshotState {
  originalPmDoc: Record<string, any> | null
  snapshots: SnapshotLabel[]
  snapshotsMap: Map<string, ManuscriptSnapshot>
  inspectedSnapshot: ManuscriptSnapshot | null
}

export const useSnapshotStore = (api: Api) =>
  create(
    combine(
      {
        originalPmDoc: null,
        snapshots: [],
        snapshotsMap: new Map(),
        inspectedSnapshot: null,
      } as SnapshotState,
      (set, get) => ({
        init() {
          set({
            originalPmDoc: null,
            snapshots: [],
            snapshotsMap: new Map(),
            inspectedSnapshot: null,
          })
        },
        setSnapshots(snapshots: SnapshotLabel[]) {
          set({ snapshots })
        },
        setOriginalPmDoc: (pmDoc: Record<string, any>) => {
          set({ originalPmDoc: pmDoc })
        },
        inspectSnapshot: async (id: string) => {
          const inspected = get().snapshotsMap.get(id) ?? null
          set({ inspectedSnapshot: inspected })
          if (inspected) {
            return { data: inspected }
          }
          const resp = await api.get<IGetSnapshotResponse>(`snapshot/${id}`)
          if (resp) {
            set((state) => ({
              snapshotsMap: state.snapshotsMap.set(id, resp),
              inspectedSnapshot: resp,
            }))
          }
          return resp
        },
        resumeEditing: () => {
          set({
            inspectedSnapshot: null,
          })
        },
        saveSnapshot: async (projectID: string, manuscriptID: string) => {
          const resp = await api.post<ISaveSnapshotResponse>(
            `snapshot/${projectID}/manuscript/${manuscriptID}`,
            {
              docID: manuscriptID,
              name: new Date().toLocaleString('sv'),
            }
          )

          if (resp) {
            const { snapshot } = resp
            set((state) => {
              const { snapshotsMap } = state
              let { snapshots } = state
              snapshotsMap.set(snapshot.id, snapshot)
              snapshots = [
                ...snapshots,
                {
                  id: snapshot.id,
                  createdAt: snapshot.createdAt,
                  name: snapshot.name,
                },
              ]
              return {
                snapshots,
                snapshotsMap,
              }
            })
          }
          return resp
        },
        updateSnapshot: async (
          snapId: string,
          values: IUpdateSnapshotRequest
        ) => {
          const resp = await api.put(`snapshot/${snapId}`, values)
          if (resp) {
            set((state) => {
              let { snapshots, snapshotsMap } = state
              const oldSnap = snapshotsMap.get(snapId)
              if (oldSnap) {
                snapshotsMap = snapshotsMap.set(snapId, {
                  ...oldSnap,
                  ...values,
                })
              }
              snapshots = snapshots.map((s) =>
                s.id === snapId ? { ...s, ...values } : s
              )
              return {
                snapshotsMap,
                snapshots,
              }
            })
          }
          return resp
        },
        deleteSnapshot: async (snapId: string) => {
          const resp = await api.delete(`snapshot/${snapId}`)
          if (resp) {
            set((state) => {
              const { snapshotsMap } = state
              let { snapshots } = state
              snapshotsMap.delete(snapId)
              snapshots = snapshots.filter((s) => s.id !== snapId)
              return {
                snapshots,
                snapshotsMap,
              }
            })
          }
          return resp
        },
      })
    )
  )
