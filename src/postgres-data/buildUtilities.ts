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

import { ObjectTypes, Project } from '@manuscripts/json-schema'

import { getUserRole } from '../lib/roles'
import Api from '../postgres-data/Api'
import { state } from '../store'

export const buildUtilities = (
  projectID: string,
  manuscriptID: string,
  getState: () => Partial<state>,
  updateState: (state: Partial<state>) => void,
  api: Api
): Partial<state> => {
  const createSnapshot = async () => {
    const state = getState()
    const snapshots = state.snapshots
    const snapshotsMap = state.snapshotsMap
    if (!snapshots || !snapshotsMap) {
      throw new Error('Unable to create snapshot due to incomplete data')
    }
    const data = await api.createSnapshot(projectID, manuscriptID)
    const { snapshot, ...label } = data.snapshot
    updateState({
      snapshots: [...snapshots, label],
      snapshotsMap: snapshotsMap.set(label.id, data.snapshot),
    })
  }

  const refreshProject = async () => {
    const state = getState()
    const userID = state.userID
    if (!userID) {
      return
    }
    const models = await api.getManuscript(projectID, manuscriptID)
    if (!models) {
      return
    }
    const project = models.filter(
      (m) => m.objectType === ObjectTypes.Project
    )[0] as Project
    if (!project) {
      return
    }
    updateState({
      project,
      userRole: getUserRole(project, userID),
    })
  }

  return {
    createSnapshot,
    refreshProject,
  }
}
