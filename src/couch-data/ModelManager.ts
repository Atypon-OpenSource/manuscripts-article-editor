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
  Build,
  ContainedModel,
  ContainedProps,
  Decoder,
  getModelsByType,
  isManuscriptModel,
  ManuscriptNode,
  ModelAttachment,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Bundle,
  Correction,
  LibraryCollection,
  Manuscript,
  Model,
  ObjectTypes,
  Snapshot,
} from '@manuscripts/manuscripts-json-schema'
import { RxDatabase } from '@manuscripts/rxdb'
import {
  Commit,
  commitToJSON,
  findCommitWithChanges,
} from '@manuscripts/track-changes'

import { getSnapshot } from '../lib/snapshot'
import { JsonModel } from '../pressroom/importers'
import { ContainerIDs } from '../store'
import { Collection } from '../sync/Collection'

type ModelMap = Map<string, Model> // this is duplicated and copied in several places

interface ManuscriptModels {
  getModel: <T extends Model>(id: string) => T | undefined
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  deleteModel: (id: string) => Promise<string>
  bundle: Bundle | null
  collection: Collection<ContainedModel>
  modelMap: ModelMap
  setModelsState: (modelMap: Map<string, Model>) => void
}

export default class ModelManager implements ManuscriptModels {
  bundle: Bundle | null
  collection: Collection<ContainedModel>
  userCollection: Collection<ContainedModel>
  modelMap: ModelMap
  setModelsState: (modelMap: Map<string, Model>) => void
  manuscriptID: string
  containerID: string
  snapshots: Snapshot[]
  commits: Commit[]
  db: RxDatabase<any>
  constructor(
    modelMap: Map<string, Model>,
    setModelsState: (modelMap: Map<string, Model>) => void,
    manuscriptID: string,
    projectID: string,
    collection: Collection<ContainedModel>,
    userCollection: Collection<ContainedModel>,
    snapshots: Snapshot[],
    commits: Commit[],
    db: RxDatabase<any>
  ) {
    this.snapshots = snapshots
    this.commits = commits
    this.collection = collection
    this.userCollection = userCollection
    this.manuscriptID = manuscriptID
    this.setModelsState = setModelsState
    this.containerID = projectID
    this.modelMap = modelMap
    this.db = db
  }

  buildModelMapFromJson = (models: JsonModel[]): Map<string, JsonModel> => {
    return new Map(
      models.map((model) => {
        if (model.objectType === ObjectTypes.Figure && model.attachment) {
          model.src = window.URL.createObjectURL(model.attachment.data)
        }
        return [model._id, model]
      })
    )
  }

  createProjectLibraryCollection = async (
    libraryCollection: Build<LibraryCollection>,
    projectID?: string
  ) => {
    await this.collection.create(libraryCollection, {
      containerID: projectID,
    })
  }

  getTools = async () => {
    const latestSnaphot = this.snapshots.length ? this.snapshots[0] : null

    if (!latestSnaphot || !latestSnaphot.s3Id) {
      const decoder = new Decoder(this.modelMap, true)
      const doc = decoder.createArticleNode()
      const ancestorDoc = decoder.createArticleNode()
      return {
        snapshotID: null,
        commits: this.commits,
        commitAtLoad: null,
        snapshots: this.snapshots,
        doc,
        ancestorDoc,
        saveModel: this.saveModel,
        deleteModel: this.deleteModel,
        saveManuscript: this.saveManuscript,
        getModel: this.getModel,
        saveCommit: this.saveCommit,
        saveCorrection: this.saveCorrection,
        createProjectLibraryCollection: this.createProjectLibraryCollection,
        saveBiblioItem: this.saveBiblioItem,
        deleteBiblioItem: this.deleteBiblioItem,
        updateBiblioItem: this.updateBiblioItem,
        bulkUpdate: this.bulkUpdate,
      }
    }

    const modelsFromSnapshot = await getSnapshot(
      this.containerID,
      latestSnaphot.s3Id
    ).catch((e) => {
      console.log(e)
      throw new Error('Failed to load snapshot')
    })
    const snapshotModelMap = this.buildModelMapFromJson(
      modelsFromSnapshot.filter(
        (doc: any) =>
          !doc.manuscriptID || doc.manuscriptID === this.manuscriptID
      )
    )
    // to use modelMap for test here
    const decoder = new Decoder(snapshotModelMap, true)
    const doc = decoder.createArticleNode() as ManuscriptNode
    const ancestorDoc = decoder.createArticleNode() as ManuscriptNode

    const corrections = (getModelsByType(
      this.modelMap,
      ObjectTypes.Correction
    ) as Correction[]).filter(
      (corr) => corr.snapshotID === this.snapshots[0]._id
    )

    const unrejectedCorrections = corrections
      .filter((cor) => cor.status.label !== 'rejected')
      .map((cor) => cor.commitChangeID || '')

    const commitAtLoad =
      findCommitWithChanges(this.commits, unrejectedCorrections) || null

    return {
      snapshotID: this.snapshots[0]._id,
      commits: this.commits,
      commitAtLoad,
      snapshots: this.snapshots,
      doc,
      ancestorDoc,
      saveModel: this.saveModel,
      deleteModel: this.deleteModel,
      saveManuscript: this.saveManuscript,
      getModel: this.getModel,
      saveCommit: this.saveCommit,
      saveCorrection: this.saveCorrection,
      createProjectLibraryCollection: this.createProjectLibraryCollection,
      saveBiblioItem: this.saveBiblioItem,
      deleteBiblioItem: this.deleteBiblioItem,
      updateBiblioItem: this.updateBiblioItem,
      bulkUpdate: this.bulkUpdate,
    }
  }

  saveBiblioItem = async (item: Build<BibliographyItem>, projectID: string) => {
    return await this.collection.create(item, {
      containerID: projectID,
    })
  }

  updateBiblioItem = (item: BibliographyItem) => {
    return this.collection.update(item._id, item)
  }

  deleteBiblioItem = (item: BibliographyItem) => {
    return this.collection.delete(item._id)
  }

  saveCorrection = (correction: Correction) => {
    return this.collection.save(correction)
  }

  saveCommit = (commit: Commit) => {
    return this.collection.save(commitToJSON(commit, this.containerID))
  }

  getModel = <T extends Model>(id: string) => {
    if (!this.modelMap) {
      return
    }
    return this.modelMap.get(id) as T | undefined
  }

  bulkUpdate = async (items: Array<ContainedModel>): Promise<void> => {
    for (const value of items) {
      const containerIDs: ContainerIDs = {
        containerID: this.containerID,
      }
      if (isManuscriptModel(value)) {
        containerIDs.manuscriptID = this.manuscriptID
      }
      await this.collection.save(value, containerIDs, true)
    }
  }

  saveModel = async <T extends Model>(model: T | Build<T> | Partial<T>) => {
    if (!model) {
      console.log(new Error().stack)
    }
    if (!model._id) {
      throw new Error('Model ID required')
    }

    const containedModel = model as T & ContainedProps

    // NOTE: this is needed because the local state is updated before saving
    const containerIDs: ContainerIDs = {
      containerID: this.containerID,
    }

    if (isManuscriptModel(containedModel)) {
      containerIDs.manuscriptID = this.manuscriptID
    }

    this.setModelsState(
      this.modelMap.set(containedModel._id, {
        ...containedModel,
        ...containerIDs,
      })
    )

    const { attachment, ...data } = containedModel as T &
      ContainedProps &
      ModelAttachment

    // TODO: data.contents = serialized DOM wrapper for bibliography
    const result = await this.collection.save(data, containerIDs)
    if (attachment) {
      await this.collection.putAttachment(result._id, attachment)
    }

    return result as T & ContainedProps
  }

  deleteModel = (id: string) => {
    if (this.modelMap) {
      this.modelMap.delete(id)
    }
    this.setModelsState(this.modelMap)
    return this.collection.delete(id)
  }

  saveManuscript = async (data: Partial<Manuscript>) => {
    try {
      const prevManuscript = this.modelMap.get(this.manuscriptID)
      return this.saveModel({
        ...prevManuscript,
        ...data,
      }).then(() => undefined)
    } catch (e) {
      console.log(e)
    }
  }
}
