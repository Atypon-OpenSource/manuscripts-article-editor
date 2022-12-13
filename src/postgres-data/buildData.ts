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
  Decoder,
  getModelData,
  isCommentAnnotation,
  isManuscript,
  ManuscriptNode,
  schema,
} from '@manuscripts/manuscript-transform'
import {
  Affiliation,
  BibliographyItem,
  CommentAnnotation,
  Commit as CommitJson,
  Contributor,
  ContributorRole,
  Correction,
  LibraryCollection,
  ManuscriptNote,
  Model,
  ObjectTypes,
  Project,
  Snapshot,
  Tag,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { FileManagement } from '@manuscripts/style-guide'
import {
  Commit,
  commitFromJSON,
  findCommitWithChanges,
} from '@manuscripts/track-changes'

import { buildAuthorsAndAffiliations } from '../lib/authors'
import { buildCollaboratorProfiles } from '../lib/collaborators'
import { replaceAttachmentsIds } from '../lib/replace-attachments-ids'
import { getUserRole } from '../lib/roles'
import { getSnapshot } from '../lib/snapshot'
import { state } from '../store'
import { TokenData } from '../store/TokenData'
import Api from './Api'

export const buildModelMap = async (
  docs: Model[]
): Promise<Map<string, Model>> => {
  const items: Map<string, Model> = new Map()
  const output: Map<string, Model> = new Map()

  await Promise.all(
    docs.map(async (doc) => {
      items.set(doc._id, doc)
      output.set(doc._id, getModelData(doc))
    })
  )

  // for (const model of output.values()) {
  // @TODO images are not stored in the manuscripts api under the LW mode, but managed in the LW store.
  // we still however need to support local image management

  // if (isFigure(model)) {
  //   if (model.listingAttachment) {
  //     const { listingID, attachmentKey } = model.listingAttachment

  //     const listingDoc = items.get(listingID)

  //     if (listingDoc) {
  //       model.src = await getAttachment(listingDoc, attachmentKey)
  //     }
  //   } else {
  //     const figureDoc = items.get(model._id)

  //     if (figureDoc) {
  //       model.src = await getAttachment(figureDoc, 'image')
  //     }
  //   }
  // }

  // TODO: enable once tables can be images
  // else if (isTable(model)) {
  //   if (model.listingAttachment) {
  //     const { listingID, attachmentKey } = model.listingAttachment
  //     const listingDoc = items.get(listingID)
  //
  //     if (listingDoc) {
  //       model.src = await getAttachment(listingDoc, attachmentKey)
  //     }
  //   } else {
  //     const tableDoc = items.get(model._id)!
  //     model.src = await getAttachment(tableDoc, 'image')
  //   }
  // }
  // if (isUserProfile(model)) {
  //   const userProfileDoc = items.get(model._id)

  //   if (userProfileDoc) {
  //     model.avatar = await getAttachment(userProfileDoc, 'image')
  //   }
  // }
  // }

  return output
}

const isSnapshot = (model: Model) => model.objectType === ObjectTypes.Snapshot
const isTag = (model: Model) => model.objectType === ObjectTypes.Tag
const isCommit = (model: Model) => model.objectType === ObjectTypes.Commit
const isCorrection = (model: Model) =>
  model.objectType === ObjectTypes.Correction
const isManuscriptNote = (model: Model) =>
  model.objectType === ObjectTypes.ManuscriptNote

// Project data come along with the manuscript data. We may return to this so it's commented for now.
// const getProjectData = async (projectID: string, api: Api) => {
//   const project = await api.getProject(projectID)
//   if (project) {
//     return project
//   }
//   throw new Error("Can't find the project by ID")
// }

const buildDocsMap = <T extends Model>(docs: T[]) => {
  const docsMap = new Map<string, any>()
  for (const doc of docs) {
    docsMap.set(doc._id, doc)
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
      continue
    }
    if (isManuscript(model)) {
      data.manuscript = model
      continue
    }
    if (isSnapshot(model)) {
      data.snapshots = data.snapshots
        ? ([...data.snapshots, model] as Snapshot[])
        : ([model] as Snapshot[])
      continue
    }
    if (isManuscriptNote(model)) {
      data.notes = data.notes
        ? ([...data.notes, model] as ManuscriptNote[])
        : ([model] as ManuscriptNote[])
      continue
    }
    if (isTag(model)) {
      data.tags = data.tags
        ? ([...data.tags, model] as Tag[])
        : ([model] as Tag[])
      continue
    }
    if (isCorrection(model)) {
      data.corrections = data.corrections
        ? ([...data.corrections, model] as Correction[])
        : ([model] as Correction[])
    }
    if (isCommentAnnotation(model)) {
      data.comments = data.comments
        ? ([...data.comments, model] as CommentAnnotation[])
        : ([model] as CommentAnnotation[])
    }
    if (isCommit(model)) {
      const commit = commitFromJSON(model as CommitJson, schema)
      data.commits = data.commits
        ? ([...data.commits, model] as Commit[])
        : ([commit] as Commit[])
    }
  }
  data.commits = data.commits || []
  data.modelMap = await buildModelMap(models || [])

  return data
}

const getLibrariesData = async (projectID: string, api: Api) => {
  const libraries = await api.getProjectModels<Model>(projectID, [
    'MPLibraryCollection',
    'MPBibliographyItem',
  ])
  if (libraries) {
    return libraries.reduce(
      (acc, item) => {
        if (item.objectType === ObjectTypes.BibliographyItem) {
          acc.library.set(item._id, item as BibliographyItem)
        }
        if (item.objectType === ObjectTypes.LibraryCollection) {
          acc.projectLibraryCollections.set(item._id, item as LibraryCollection)
        }
        return acc
      },
      {
        projectLibraryCollections: new Map<string, LibraryCollection>(),
        library: new Map<string, BibliographyItem>(),
      }
    )
  }
  return null
}

const getCollaboratorsData = async (
  projectID: string,
  data: Partial<state>,
  user: UserProfile,
  api: Api
) => {
  const collabsData: Partial<state> = {}
  const collaboratorsProfiles = await api.getCollaborators(projectID)
  if (collaboratorsProfiles) {
    const collaborators = buildDocsMap(collaboratorsProfiles)
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

const buildModelMapFromJson = (models: Model[]) => {
  return new Map(
    models.map((model) => {
      return [model._id, model]
    })
  )
}

const getDrivedData = async (
  manuscriptID: string,
  projectID: string,
  data: Partial<state>,
  alternatedModelMap?: Map<string, Model>
) => {
  let storeData: Partial<state>

  if (!data.modelMap || !projectID) {
    return null
  }

  const latestSnaphot = data?.snapshots?.length ? data.snapshots[0] : null
  if (!latestSnaphot) {
    const decoder = new Decoder(alternatedModelMap || data.modelMap, true)
    const doc = decoder.createArticleNode()
    const ancestorDoc = decoder.createArticleNode()
    storeData = {
      snapshotID: null,
      commitAtLoad: null,
      ancestorDoc,
      doc,
    }
  } else {
    // This is obsolete. Shackles are not used anymore
    const modelsFromSnapshot = await getSnapshot(
      projectID,
      latestSnaphot.s3Id!
    ).catch((e) => {
      console.log(e)
      throw new Error('Failed to load snapshot')
    })
    const snapshotModelMap = buildModelMapFromJson(
      modelsFromSnapshot.filter(
        (doc: any) => !doc.manuscriptID || doc.manuscriptID === manuscriptID
      )
    )
    const unrejectedCorrections = (data.corrections as Correction[])
      .filter(
        (cor) =>
          cor.snapshotID === data.snapshots![0]._id &&
          cor.status.label !== 'rejected'
      )
      .map((cor) => cor.commitChangeID || '')

    const commitAtLoad =
      findCommitWithChanges(data.commits || [], unrejectedCorrections) || null
    const decoder = new Decoder(snapshotModelMap, true)
    const doc = decoder.createArticleNode() as ManuscriptNode
    const ancestorDoc = decoder.createArticleNode() as ManuscriptNode
    storeData = {
      snapshotID: data.snapshots![0]._id,
      modelMap: snapshotModelMap,
      commitAtLoad,
      ancestorDoc,
      doc,
    }
  }

  const affiliationAndContributors: (Contributor | Affiliation)[] = []
  const contributorRoles: ContributorRole[] = []

  for (const model of data.modelMap?.values()) {
    if (
      model.objectType === ObjectTypes.Affiliation ||
      model.objectType === ObjectTypes.Contributor
    ) {
      affiliationAndContributors.push(model as Affiliation) // or Contributor
    }
    if (model.objectType === ObjectTypes.ContributorRole) {
      contributorRoles.push(model as ContributorRole)
    }
  }
  storeData.authorsAndAffiliations = buildAuthorsAndAffiliations(
    affiliationAndContributors
  )
  storeData.contributorRoles = contributorRoles
  return storeData
}

export default async function buildData(
  projectID: string,
  manuscriptID: string,
  api: Api,
  attachments?: ReturnType<FileManagement['getAttachments']>
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

  const projects = await api.getUserProjects()
  const librariesData = await getLibrariesData(projectID, api)

  // replace attachments with src
  let noAttachmentsModelMap: Map<string, Model> | undefined = undefined
  if (attachments && manuscriptData.modelMap) {
    noAttachmentsModelMap = replaceAttachmentsIds(
      manuscriptData.modelMap,
      attachments
    )
  }

  const derivedData = await getDrivedData(
    manuscriptID,
    projectID,
    manuscriptData,
    noAttachmentsModelMap
  )

  return {
    projects: projects,
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
    ...librariesData,
    ...manuscriptData,
    tokenData: new TokenData(),
  }
}
