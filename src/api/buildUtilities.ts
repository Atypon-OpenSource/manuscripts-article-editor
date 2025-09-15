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

import { getUserRole } from '../lib/roles'
import { state } from '../store'
import { Api } from './Api'

export const buildUtilities = (
  projectID: string,
  manuscriptID: string,
  getState: () => Partial<state>,
  updateState: (state: Partial<state>) => void,
  api: Api,
  userID: string // Added userID parameter
): Partial<state> => {
  const createSnapshot = async (name: string) => {
    const state = getState()
    const snapshots = state.snapshots
    if (!snapshots) {
      throw new Error('Missing snapshots')
    }
    const response = await api.createSnapshot(projectID, manuscriptID, name)
    const { snapshot, ...label } = response.snapshot
    updateState({
      snapshots: [...snapshots, label],
    })
  }

  const refreshProject = async () => {
    console.log('refreshProject: Starting project refresh', {
      projectID,
      userID,
      userIDType: typeof userID,
      timestamp: new Date().toISOString(),
    })

    // Try to get userID from parameter first, then from state as fallback
    let effectiveUserID: string | undefined = userID
    if (!effectiveUserID) {
      const state = getState()
      effectiveUserID = state.userID
      console.log(
        'refreshProject round3: userID not provided, trying to get from state',
        {
          stateUserID: effectiveUserID,
          stateUserIDType: typeof effectiveUserID,
        }
      )
    }

    if (!effectiveUserID) {
      console.log(
        'refreshProject round3: No userID available from parameter or state, skipping refresh',
        {
          paramUserID: userID,
          paramUserIDType: typeof userID,
          stateUserID: effectiveUserID,
          stateUserIDType: typeof effectiveUserID,
        }
      )
      return
    }

    console.log('refreshProject: Fetching project data...', { effectiveUserID })
    const project = await api.getProject(projectID)
    if (!project) {
      console.log('refreshProject: No project data received')
      return
    }

    const newUserRole = getUserRole(project, effectiveUserID)
    console.log('refreshProject: Updating state with new project data', {
      projectId: project._id,
      userRole: newUserRole,
      effectiveUserID,
      timestamp: new Date().toISOString(),
    })

    updateState({
      project,
      userRole: newUserRole,
    })

    console.log('refreshProject: Project refresh completed')
  }

  return {
    createSnapshot,
    refreshProject,
    getSnapshot: api.getSnapshot,
  }
}
