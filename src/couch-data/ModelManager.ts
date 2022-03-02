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
import { Collection, ContainerIDs } from '../sync/Collection'
import {
  Bundle,
  Manuscript,
  Model,
  Correction,
} from '@manuscripts/manuscripts-json-schema'

import {
  checkout,
  commands,
  Commit,
  commitToJSON,
  findCommitWithChanges,
  findCommitWithin,
  getChangeSummary,
  getTrackPluginState,
  isCommitContiguousWithSelection,
  rebases,
  reset as resetToLastCommit,
} from '@manuscripts/track-changes'

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

import {
  Build,
  ContainedModel,
  ContainedProps,
  isManuscriptModel,
  ModelAttachment,
} from '@manuscripts/manuscript-transform'

export default class ModelManager implements ManuscriptModels {
  //   getModel: <T extends Model>(id: string) => T | undefined
  //   saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  //   saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  //   deleteModel: (id: string) => Promise<string>
  bundle: Bundle | null
  collection: Collection<ContainedModel>
  modelMap: ModelMap
  setModelsState: (modelMap: Map<string, Model>) => void
  manuscriptID: string
  containerID: string
  constructor(
    modelMap: Map<string, Model>,
    setModelsState: (modelMap: Map<string, Model>) => void,
    manuscriptID: string,
    projectID: string,
    collection: Collection<ContainedModel>
  ) {
    this.collection = collection
    this.manuscriptID = manuscriptID
    this.setModelsState = setModelsState
    this.containerID = projectID
    console.log(modelMap)
    this.modelMap = modelMap
  }

  getTools = () => {
    return {
      saveModel: this.saveModel,
      deleteModel: this.deleteModel,
      saveManuscript: this.saveManuscript,
      getModel: this.getModel,
      getAttachment: this.collection.getAttachment,
      putAttachment: this.collection.putAttachment,
    }
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

  saveModel = async (model: T | Build<T> | Partial<T>) => {
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
    // if (!modelsState) {
    //   return
    // }
    try {
      const prevManuscript = this.modelMap.get(this.manuscriptID)
      return this.saveModel({
        ...prevManuscript,
        ...data,
      }).then(() => undefined)
    } catch (e) {
      console.log(e)
      console.log(this)
    }
  }
}
