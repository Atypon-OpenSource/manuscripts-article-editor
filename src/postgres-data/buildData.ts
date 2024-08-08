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
import { ObjectTypes, Project, UserProfile } from '@manuscripts/json-schema'
import { ActualManuscriptNode, ManuscriptNode } from '@manuscripts/transform'

import { getUserRole } from '../lib/roles'
import { state } from '../store'
import { TokenData } from '../store/TokenData'
import Api from './Api'

const getProject = async (
  api: Api,
  projectID: string,
  manuscriptID: string
) => {
  const models = await api.getManuscript(projectID, manuscriptID)
  if (!models) {
    throw new Error('Models are wrong.')
  }
  for (const model of models) {
    if (model.objectType === ObjectTypes.Project) {
      return model as Project
    }
  }
}

const getManuscriptData = async (api: Api, prototype: string) => {
  const data: Partial<state> = {}
  const [sectionCategories, cslLocale, template] = await Promise.all([
    api.getSectionCategories(),
    // TODO:: config this!
    api.getCSLLocale('en-US'),
    api.getTemplate(prototype),
  ])

  const bundle = await api.getBundle(template)
  data.sectionCategories = sectionCategories || []
  data.cslStyle = await api.getCSLStyle(bundle)
  data.cslLocale = cslLocale

  return data
}

const getUserData = async (projectID: string, user: UserProfile, api: Api) => {
  const profilesById = new Map()
  profilesById.set(user._id, user)
  const profiles = await api.getUserProfiles(projectID)
  if (profiles) {
    for (const profile of profiles) {
      if (profile) {
        profilesById.set(profile._id, profile)
      }
    }
  }
  return {
    collaboratorsById: profilesById,
  }
}

export const buildData = async (
  projectID: string,
  manuscriptID: string,
  doc: ManuscriptNode,
  api: Api
) => {
  const user = await api.getUser()
  if (!user) {
    return {}
  }

  const manuscript = doc as ActualManuscriptNode
  const state = await getManuscriptData(api, manuscript.attrs.prototype)
  const project = await getProject(api, projectID, manuscriptID)
  const role = project ? getUserRole(project, user.userID) : null
  const users = await getUserData(projectID, user, api)

  return {
    user,
    userRole: role,
    ...users,
    ...state,
    project,
    tokenData: new TokenData(),
  }
}
