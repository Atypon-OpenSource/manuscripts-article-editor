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
  api: Api
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
    console.log('=== refreshProject: Starting comprehensive userID testing ===')
    const state = getState()

    // Log all available state data
    console.log('refreshProject: Available state data:', {
      stateKeys: Object.keys(state),
      stateUserID: state.userID,
      stateUserIDType: typeof state.userID,
      stateUser: state.user,
      stateUserType: typeof state.user,
      stateUserIDFromUser: state.user?._id,
      stateUserIDFromUserType: typeof state.user?._id,
      stateUserBibliographicName: state.user?.bibliographicName,
      stateUserEmail: state.user?.email,
    })

    // Try multiple ways to get userID
    const userIDSources = [
      { name: 'state.userID', value: state.userID },
      { name: 'state.user._id', value: state.user?._id },
      { name: 'state.user.userID', value: state.user?.userID },
    ]

    console.log('refreshProject: Testing userID sources:', userIDSources)

    // Find the first valid userID
    let userID: string | null = null
    let userIDSource: string | null = null

    for (const source of userIDSources) {
      if (source.value) {
        userID = source.value
        userIDSource = source.name
        console.log(`refreshProject: Found userID from ${source.name}:`, {
          userID: userID,
          userIDType: typeof userID,
          userIDLength: userID?.length,
        })
        break
      }
    }

    // If still no userID, try API as fallback
    if (!userID) {
      console.log(
        'refreshProject: No userID from state, trying API fallback...'
      )
      try {
        const userProfile = await api.getUser()
        userID = userProfile?._id || null
        userIDSource = 'api.getUser()._id'
        console.log('refreshProject: Got userID from API:', {
          userID: userID,
          userIDType: typeof userID,
          userIDLength: userID?.length,
          userProfile: userProfile,
        })
      } catch (error) {
        console.log('refreshProject: Failed to get user from API:', error)
      }
    }

    if (!userID) {
      console.log(
        'refreshProject: No userID available from any source, skipping refresh'
      )
      return
    }

    console.log('refreshProject: Final userID selected:', {
      userID: userID,
      userIDType: typeof userID,
      userIDLength: userID?.length,
      source: userIDSource,
    })

    console.log('refreshProject: Fetching project data...', { userID })
    const project = await api.getProject(projectID)
    if (!project) {
      console.log('refreshProject: No project data received')
      return
    }

    // Log project role arrays
    console.log('refreshProject: Project role arrays:', {
      projectId: project._id,
      projectOwners: project.owners,
      projectWriters: project.writers,
      projectViewers: project.viewers,
      projectEditors: project.editors,
      projectAnnotators: project.annotators,
      projectProofers: project.proofers,
      ownersCount: project.owners?.length,
      writersCount: project.writers?.length,
      viewersCount: project.viewers?.length,
      editorsCount: project.editors?.length,
      annotatorsCount: project.annotators?.length,
      proofersCount: project.proofers?.length,
    })

    // Test userID against each role array
    const roleChecks = {
      isOwner: project.owners?.includes(userID),
      isWriter: project.writers?.includes(userID),
      isViewer: project.viewers?.includes(userID),
      isEditor: project.editors?.includes(userID),
      isAnnotator: project.annotators?.includes(userID),
      isProofer: project.proofers?.includes(userID),
    }

    console.log('refreshProject: Role checks for userID:', {
      userID: userID,
      roleChecks: roleChecks,
      isInAnyRole: Object.values(roleChecks).some(Boolean),
    })

    const newUserRole = getUserRole(project, userID)
    console.log('refreshProject: getUserRole result:', {
      userID: userID,
      userRole: newUserRole,
      userRoleType: typeof newUserRole,
    })

    console.log('refreshProject: Updating state with new project data', {
      projectId: project._id,
      userRole: newUserRole,
      userID: userID,
      userIDSource: userIDSource,
      timestamp: new Date().toISOString(),
    })

    updateState({
      project,
      userRole: newUserRole,
    })

    console.log('=== refreshProject: Project refresh completed ===')
  }

  return {
    createSnapshot,
    refreshProject,
    getSnapshot: api.getSnapshot,
  }
}
