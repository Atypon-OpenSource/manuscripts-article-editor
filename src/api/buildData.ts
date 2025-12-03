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
import { UserProfile } from '@manuscripts/json-schema'
import { schema } from '@manuscripts/transform'

import { getUserRole } from '../lib/roles'
import { state } from '../store'
import { Api } from './Api'

const convertNodeNamesToTypes = (nodeNames: string[]) => {
  return nodeNames
    .map((nodeName) => {
      const nodeType = schema.nodes[nodeName]
      if (!nodeType) {
        console.warn(`Unknown node type: ${nodeName}`)
        return null
      }
      return nodeType
    })
    .filter((nodeType) => nodeType !== null)
}

const getDocumentData = async (
  projectID: string,
  manuscriptID: string,
  api: Api
) => {
  const response = await api.getDocument(projectID, manuscriptID)
  if (!response) {
    throw new Error('Document not found')
  }
  return {
    doc: schema.nodeFromJSON(response.doc),
    initialDocVersion: response.version,
    snapshots: response.snapshots,
  }
}

const getManuscriptData = async (templateID: string, api: Api) => {
  const data: Partial<state> = {}
  const [cslLocale, template, languages] = await Promise.all([
    // TODO:: config this!
    api.getCSLLocale('en-US'),
    api.getTemplate(templateID),
    api.getLanguages(),
  ])

  if (!template) {
    return data
  }

  const bundle = await api.getBundle(template)
  if (!bundle) {
    return data
  }

  data.sectionCategories = new Map(
    template.sectionCategories.map((c) => [c.id, c])
  )
  if (template.hiddenNodeTypes) {
    data.hiddenNodeTypes = convertNodeNamesToTypes(template.hiddenNodeTypes)
  }

  data.cslStyle = await api.getCSLStyle(bundle)
  data.cslLocale = cslLocale
  data.languages = languages || []

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
  api: Api
) => {
  const user = await api.getUser()
  if (!user) {
    return {}
  }

  const doc = await getDocumentData(projectID, manuscriptID, api)
  const state = await getManuscriptData(doc.doc.attrs.prototype, api)
  const project = await api.getProject(projectID)
  const role = project ? getUserRole(project, user.userID) : null
  const users = await getUserData(projectID, user, api)

  return {
    user,
    userRole: role,
    ...users,
    ...state,
    ...doc,
    project,
  }
}
