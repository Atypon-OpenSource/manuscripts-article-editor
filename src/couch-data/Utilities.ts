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
  Attachment,
  Build,
  ContainedModel,
  ManuscriptModel,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  ContainerInvitation,
  Manuscript,
  ManuscriptTemplate,
  Model,
  ObjectTypes,
  Project,
  Snapshot,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { RxDatabase } from '@manuscripts/rxdb'
import { Commit } from '@manuscripts/track-changes'

import { BulkCreateError } from '../lib/errors'
import { ContainedIDs } from '../store'
import { Collection, isBulkDocsError } from '../sync/Collection'
import CollectionManager from '../sync/CollectionManager'
import { createAndPushNewProject, createProjectCollection } from './collections'

export default class Utilities {
  bundle: Bundle | null
  collection: Collection<ContainedModel>
  userCollection: Collection<ContainedModel>
  setModelsState: (modelMap: Map<string, Model>) => void
  manuscriptID: string
  containerID: string
  snapshots: Snapshot[]
  commits: Commit[]
  db: RxDatabase<any>
  constructor(db: RxDatabase<any>) {
    this.db = db
  }

  init = async (userID: string) => {
    userID = userID || 'b5ece811-577e-41e3-8d5b-073c4712c042'
    if (userID) {
      await CollectionManager.createCollection({
        collection: 'user',
        channels: [
          userID, // invitations
          `${userID}-readwrite`, // profile
          // `${userProfileID}-readwrite`, // profile
          `${userID}-projects`, // projects
          `${userID}-libraries`, // libraries
          `${userID}-library-collections`, // library collections
        ],
        db: this.db,
      })
    }
    this.userCollection = CollectionManager.getCollection<ContainedModel>(
      'user'
    )
  }

  saveDependenciesForNew = async (
    dependencies: Array<Build<ContainedModel> & ContainedIDs>,
    collection: Collection<ContainedModel | ManuscriptModel>
  ) => {
    const results = await collection.bulkCreate(dependencies)
    const failures = results.filter(isBulkDocsError)
    if (failures.length) {
      throw new BulkCreateError(failures)
    }
  }

  saveNewManuscript = async (
    dependencies: Array<Build<ContainedModel> & ContainedIDs>,
    containerID: string,
    manuscript: Build<Manuscript>,
    newProject?: Build<Project>
  ) => {
    if (newProject) {
      await createAndPushNewProject(newProject)
    }
    const collection = await createProjectCollection(this.db, containerID)
    await this.saveDependenciesForNew(dependencies, collection)
    await collection.create(manuscript, { containerID })
    return Promise.resolve(manuscript)
  }

  updateManuscriptTemplate = async (
    dependencies: Array<Build<ContainedModel> & ContainedIDs>,
    containerID: string,
    manuscript: Manuscript,
    updatedModels: ManuscriptModel[]
  ) => {
    const collection = await createProjectCollection(this.db, containerID)
    // save the manuscript dependencies
    const results = await collection.bulkCreate(dependencies)
    const failures = results.filter(isBulkDocsError)

    if (failures.length) {
      throw new BulkCreateError(failures)
    }

    // save the updated models
    for (const model of updatedModels) {
      await collection.save(model)
    }

    // save the manuscript
    await collection.save(manuscript)
    return Promise.resolve(manuscript)
  }

  getUserTemplates = async () => {
    const userTemplates: ManuscriptTemplate[] = []
    const userTemplateModels: ManuscriptModel[] = []
    const promiseEverything = this.userCollection
      .find({
        objectType: ObjectTypes.Project,
        templateContainer: true,
      })
      .exec()
      .then((docs) => docs.map((doc) => doc.toJSON()))
      .then((projects) =>
        Promise.all(
          projects.map(async (project) => {
            const collection = new Collection({
              collection: `project-${project._id}`,
              channels: [`${project._id}-read`, `${project._id}-readwrite`],
              db: this.db,
            })

            let retries = 0
            while (retries <= 1) {
              try {
                await collection.initialize(false)
                await collection.syncOnce('pull')
                break
              } catch (e) {
                retries++
                console.error(e)
              }
            }

            const templates = await collection
              .find({ objectType: ObjectTypes.ManuscriptTemplate })
              .exec()
              .then((docs) =>
                docs.map((doc) => doc.toJSON() as ManuscriptTemplate)
              )
            userTemplates.push(...templates)

            const models = await collection
              .find({
                templateID: {
                  $in: templates.map((template) => template._id),
                },
              })
              .exec()
              .then((docs) =>
                docs.map((doc) => doc.toJSON() as ManuscriptModel)
              )
            userTemplateModels.push(...models)
            return
          })
        )
      )

    await promiseEverything
    return { userTemplates, userTemplateModels }
  }

  createUser = async (profile: Build<UserProfile>) => {
    const userCollection = await CollectionManager.createCollection<UserProfile>(
      {
        collection: 'user',
        channels: [],
        db: this.db,
      }
    )

    await userCollection.create(profile)
  }

  getAttachment = async (id: string, attachmentID: string) => {
    const attachment = await this.collection.getAttachmentAsBlob(
      id,
      attachmentID
    )
    return attachment
  }
  putAttachment = (id: string, attachment: Attachment) => {
    return this.collection.putAttachment(id, attachment).then(() => undefined)
  }

  getInvitation = (
    invitingUserID: string,
    invitedEmail: string
  ): Promise<ContainerInvitation> => {
    return new Promise((resolve) => {
      const collection = this.userCollection

      const sub = collection
        .findOne({
          objectType: ObjectTypes.ContainerInvitation,
          containerID: this.manuscriptID,
          invitedUserEmail: invitedEmail,
          invitingUserID,
        })
        .$.subscribe((doc) => {
          if (doc) {
            sub.unsubscribe()
            resolve(doc.toJSON() as ContainerInvitation)
          }
        })
    })
  }

  getTools = () => {
    return {
      getInvitation: this.getInvitation,
      putAttachment: this.putAttachment,
      getAttachment: this.getAttachment,
      createUser: this.createUser,
      updateManuscriptTemplate: this.updateManuscriptTemplate,
      saveNewManuscript: this.saveNewManuscript,
    }
  }
}
