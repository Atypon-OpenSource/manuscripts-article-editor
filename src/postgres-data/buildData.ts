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
import {
  getModelMap,
  Model,
  ObjectTypes,
  Project,
  UserProfile,
} from '@manuscripts/json-schema'
import { Decoder, isManuscript } from '@manuscripts/transform'

import { buildCollaboratorProfiles } from '../lib/collaborators'
import { getUserRole } from '../lib/roles'
import { state } from '../store'
import { TokenData } from '../store/TokenData'
import Api from './Api'

const buildDocsMap = <T extends Model>(docs: T[]) => {
  const docsMap = new Map<string, any>()
  for (const doc of docs) {
    if (doc) {
      docsMap.set(doc._id, doc)
    }
  }
  return docsMap
}

const getManuscriptData = async (
  projectID: string,
  manuscriptID: string,
  api: Api
) => {
  const models = await api.getManuscript(projectID, manuscriptID)
  if (!models) {
    throw new Error('Models are wrong.')
  }
  const data: Partial<state> = {}
  for (const model of models) {
    if (model.objectType === ObjectTypes.Project) {
      data.project = model as Project
    } else if (isManuscript(model)) {
      data.manuscript = model
    }
  }
  data.notes = []
  data.modelMap = getModelMap(models || [])

  const [sectionCategories, cslLocale, template] = await Promise.all([
    api.getSectionCategories(),
    // TODO:: config this!
    api.getCSLLocale('en-US'),
    api.getTemplate(data.manuscript?.prototype),
  ])

  const bundle = await api.getBundle(template)

  data.sectionCategories = sectionCategories || []
  data.cslStyle = await api.getCSLStyle(bundle)
  data.cslLocale = cslLocale

  return data
}

const getCollaboratorsData = async (
  projectID: string,
  data: Partial<state>,
  user: UserProfile,
  api: Api
) => {
  const collabsData: Partial<state> = {}
  const userProfiles = await api.getUserProfiles(projectID)
  if (userProfiles) {
    const collaborators = buildDocsMap(userProfiles)
    if (user) {
      collabsData.collaboratorsProfiles = buildCollaboratorProfiles(
        collaborators,
        user
      )
      collabsData.collaboratorsById = buildCollaboratorProfiles(
        collaborators,
        user,
        '_id'
      )
    }
  }
  // collabsData.collaboratorsProfiles = collaboratorsProfiles // why?
  return collabsData
}

const createDoc = (
  data: Partial<state>,
  alternatedModelMap?: Map<string, Model>
) => {
  if (!data.modelMap) {
    return null
  }
  const decoder = new Decoder(alternatedModelMap || data.modelMap, true)
  const doc = decoder.createArticleNode()
  return doc
}

export const getDrivedData = (projectID: string, data: Partial<state>) => {
  if (!data.modelMap || !projectID) {
    return null
  }
  const storeData: Partial<state> = {
    snapshotID: null,
  }

  const metaData = getMetaData(data.modelMap)
  storeData.authorsAndAffiliations = metaData?.authorsAndAffiliations
  storeData.contributorRoles = metaData?.contributorRoles
  return storeData
}

export default async function buildData(
  projectID: string,
  manuscriptID: string,
  api: Api
) {
  // const project = await getProjectData(projectID, api)
  const user = await api.getUser()
  if (!user) {
    return {}
  }

  const manuscriptData = await getManuscriptData(projectID, manuscriptID, api)
  const userRole = manuscriptData.project
    ? getUserRole(manuscriptData.project, user.userID)
    : null

  const collaboratorsData = await getCollaboratorsData(
    projectID,
    manuscriptData,
    user,
    api
  )

  const derivedData = getDrivedData(projectID, manuscriptData)
  const doc = createDoc(manuscriptData, manuscriptData.modelMap)

  return {
    manuscripts: [manuscriptData.manuscript],
    /* Wierd array? In lean workflow there is always only one project and a single manuscrit in it.
      These arrays have to be provided for components compatibility that shouldn't be changed as it is possible that it will change
      */
    user,
    manuscriptID: manuscriptData.manuscript?._id,
    projectID: manuscriptData.project?._id,
    userRole,
    ...derivedData,
    ...collaboratorsData,
    ...manuscriptData,
    doc,
    tokenData: new TokenData(),
  }
}
