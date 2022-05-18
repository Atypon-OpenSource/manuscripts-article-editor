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

import { ContainerIDs, state } from '../store'
import {
  Build,
  ContainedModel,
  ManuscriptModel,
  ContainedProps,
  isManuscriptModel,
  ModelAttachment,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Correction,
  LibraryCollection,
  Manuscript,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import Api from '../postgres-data/Api'
import { commitToJSON, Commit } from '@manuscripts/track-changes'
import { saveWithThrottle } from './savingUtilities'

const buildUtilities = (
  data: Partial<state>,
  api: Api,
  updateState: (state: Partial<state>) => void
) => {
  const getModel = <T extends Model>(id: string) => {
    if (!data.modelMap) {
      return
    }
    return data.modelMap.get(id) as T | undefined
  }

  //   const bulkUpdate = async (items: Array<ContainedModel>): Promise<void> => {
  //     for (const value of items) {
  //       const containerIDs: ContainerIDs = {
  //         containerID: this.containerID,
  //       }
  //       if (isManuscriptModel(value)) {
  //         containerIDs.manuscriptID = this.manuscriptID
  //       }
  //       await this.collection.save(value, containerIDs, true)
  //     }
  //   }

  const bulkPersistentProjectSave = (models: ManuscriptModel[]) => {
    // combine entire project and overwrite?
    const onlyProjectModels = models.filter((model) => !model.manuscriptID)
    if (data.projectID && data.manuscriptID) {
      api.updateProject(data.projectID, data.manuscriptID, onlyProjectModels)
    }
  }

  const bulkPersistentManuscriptSave = (models: ManuscriptModel[]) => {
    const onlyManuscriptModels = models.filter(
      (model) => model.manuscriptID === data.manuscriptID
    )
    if (data.projectID && data.manuscriptID) {
      return api
        .upsertManuscript(
          data.projectID,
          data.manuscriptID,
          onlyManuscriptModels
        )
        .then(() => {
          return true // not sure what will be returned at this point
        })
        .catch(() => {
          return false
        })
    } else {
      return Promise.reject(false)
    }
  }

  const saveModel = async <T extends Model>(
    model: T | Build<T> | Partial<T>
  ) => {
    if (!model) {
      console.log(new Error().stack)
    }
    if (!model._id) {
      throw new Error('Model ID required')
    }
    if (!data.modelMap || !data.manuscriptID || !data.containerID) {
      throw new Error(
        'State misses important element. Unable to savel a model.'
      )
    }

    const containedModel = model as T & ContainedProps

    // NOTE: this is needed because the local state is updated before saving
    const containerIDs: ContainerIDs = {
      containerID: data.containerID,
    }

    if (isManuscriptModel(containedModel)) {
      containerIDs.manuscriptID = data.manuscriptID
    }

    const newModel = {
      ...containedModel,
      ...containerIDs,
    }

    const modelMap = data.modelMap.set(containedModel._id, newModel)

    updateState({
      modelMap,
    })

    // const { attachment, ...containedModeldata } = containedModel as T &
    //   ContainedProps &
    //   ModelAttachment
    // TODO: containedModeldata.contents = serialized DOM wrapper for bibliography
    // const result = await this.collection.save(containedModeldata, containerIDs)
    // under this new API we won' save the model separately but rather trigger a bulk save once in a while
    // if (attachment) {
    //   await this.collection.putAttachment(result._id, attachment)
    // }
    // return result as T & ContainedProps

    saveWithThrottle(async () => {
      updateState({
        manuscriptSaved: 'pending',
      })
      const result = await bulkPersistentManuscriptSave([
        ...modelMap.values(),
      ] as ManuscriptModel[])
      updateState({
        manuscriptSaved: result ? 'saved' : 'failed',
      })
    })
    return newModel
  }

  const saveProjectModel = <T extends Model>(model: T | Build<T>) => {
    if (!model) {
      console.log(new Error().stack)
    }
    if (!model._id) {
      throw new Error('Model ID required')
    }
    if (!data.modelMap || !data.containerID) {
      throw new Error(
        'State misses important element. Unable to savel a model.'
      )
    }
    const containedModel = model as T & ContainedProps

    updateState({
      modelMap: data.modelMap.set(model._id, {
        ...containedModel,
        containerID: data.containerID,
      }),
    })

    saveWithThrottle(() =>
      bulkPersistentProjectSave([
        ...data.modelMap.values(),
      ] as ManuscriptModel[])
    )
  }

  const deleteModel = (id: string) => {
    if (data.modelMap) {
      data.modelMap.delete(id)
    }
    updateState({
      modelMap: data.modelMap,
    })
    // will be handled in bulk update
    // return this.collection.delete(id)
  }

  const saveManuscript = async (manuscriptData: Partial<Manuscript>) => {
    try {
      if (!data.modelMap || !data.manuscriptID) {
        throw new Error('Unable to save manuscript due to incomplete data')
      }
      const prevManuscript = data.modelMap.get(data.manuscriptID)
      return saveModel({
        ...prevManuscript,
        ...manuscriptData,
      }).then(() => undefined)
    } catch (e) {
      console.log(e)
    }
  }

  const saveBiblioItem = async (
    item: Build<BibliographyItem>,
    projectID: string
  ) => {
    return saveProjectModel(item)
  }

  const updateBiblioItem = (item: BibliographyItem) => {
    return saveModel(item) // difference between modelMap and projectModelMap are those different? should we store project level data in a different map?
    // return this.collection.update(item._id, item)
  }

  const deleteBiblioItem = (item: BibliographyItem) => {
    return data.modelMap?.delete(item._id) || false
  }

  const saveCorrection = (correction: Correction) => {
    return saveModel(correction)
  }

  const saveCommit = (commit: Commit) => {
    if (data.containerID) {
      return saveProjectModel(commitToJSON(commit, data.containerID))
    }
  }

  const createProjectLibraryCollection = async (
    libraryCollection: Build<LibraryCollection>,
    projectID?: string
  ) => {
    saveProjectModel(libraryCollection)
  }

  return {
    saveModel,
    deleteModel,
    saveManuscript,
    getModel,
    saveCommit,
    saveCorrection,
    createProjectLibraryCollection,
    saveBiblioItem,
    deleteBiblioItem,
    updateBiblioItem,
  }
}

export default buildUtilities
