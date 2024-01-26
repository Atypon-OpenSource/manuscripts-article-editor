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

import { Manuscript, Model, ObjectTypes } from '@manuscripts/json-schema'
import {
  Build,
  ContainedModel,
  ContainedProps,
  isManuscriptModel,
  ManuscriptModel,
} from '@manuscripts/transform'

import Api from '../postgres-data/Api'
import { ContainerIDs, state } from '../store'
import { saveWithThrottle } from './savingUtilities'

const buildUtilities = (
  getData: () => Partial<state>,
  api: Api,
  updateState: (state: Partial<state>) => void
) => {
  const getModel = <T extends Model>(id: string) => {
    const data = getData()
    if (!data.modelMap) {
      return
    }
    return data.modelMap.get(id) as T | undefined
  }

  const bulkPersistentManuscriptSave = (models: ManuscriptModel[]) => {
    // const onlyManuscriptModels = models.filter((model) => {
    //   return isManuscript(model) || model.manuscriptID === data.manuscriptID
    // })
    const clearedModels = models.filter((model) => {
      return model.objectType !== ObjectTypes.Project
    })

    const data = getData()

    if (data.projectID && data.manuscriptID) {
      return api
        .saveProject(data.projectID, clearedModels)
        .then(() => {
          return true // not sure what will be returned at this point
        })
        .catch((e) => {
          return false
        })
    } else {
      return Promise.reject(false)
    }
  }

  const saveModel = async <T extends Model>(
    model: T | Build<T> | Partial<T>
  ) => {
    if (!model._id) {
      throw new Error('Model ID required')
    }

    const data = getData()
    if (!data.modelMap || !data.manuscriptID || !data.projectID) {
      throw new Error(
        'State misses important element. Unable to savel a model.'
      )
    }

    const containedModel = model as T & ContainedProps

    // NOTE: this is needed because the local state is updated before saving
    const containerIDs: ContainerIDs = {
      containerID: data.projectID,
    }

    if (isManuscriptModel(containedModel)) {
      containerIDs.manuscriptID = data.manuscriptID
    }

    const newModel = {
      ...containedModel,
      ...containerIDs,
    }

    const modelMap = new Map(data.modelMap)
    modelMap.set(containedModel._id, newModel)

    // data.modelMap.set(containedModel._id, newModel)

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

    updateState({
      modelMap,
      preventUnload: true,
    })

    saveWithThrottle(async () => {
      updateState({
        savingProcess: 'saving',
      })
      const result = await bulkPersistentManuscriptSave([
        ...modelMap.values(),
      ] as ManuscriptModel[])

      updateState({
        savingProcess: result ? 'saved' : 'failed',
        preventUnload: false,
      })
    })
    return newModel
  }

  const deleteModel = async (id: string) => {
    const data = getData()
    if (data.modelMap) {
      const modelMap = new Map(data.modelMap)
      modelMap.delete(id)

      // data.modelMap.delete(id)

      updateState({
        modelMap: modelMap,
        savingProcess: 'saving',
      })
      const result = await bulkPersistentManuscriptSave([
        ...modelMap.values(),
      ] as ManuscriptModel[])
      updateState({
        savingProcess: result ? 'saved' : 'failed',
      })
    }

    return id
  }

  const saveManuscript = async (manuscriptData: Partial<Manuscript>) => {
    try {
      const data = getData()
      if (!data.modelMap || !data.manuscriptID) {
        throw new Error('Unable to save manuscript due to incomplete data')
      }
      const prevManuscript = data.modelMap.get(data.manuscriptID)
      await saveModel({
        ...prevManuscript,
        ...manuscriptData,
      })
    } catch (e) {
      console.log(e)
    }
  }

  // async ( model: T | Build<T> | Partial<T>
  const bulkUpdate = async (
    items: ContainedModel[] | Build<Model>[] | Partial<Model>[]
  ) => {
    const data = getData()

    if (!data.modelMap || !data.manuscriptID || !data.projectID) {
      throw new Error(
        'State misses important element. Unable to savel a model.'
      )
    }

    const modelMap = new Map(data.modelMap)

    for (const model of items) {
      // NOTE: this is needed because the local state is updated before saving
      const containerIDs: ContainerIDs = {
        containerID: data.projectID,
      }

      if (!model._id) {
        throw new Error('Model ID required')
      }

      const containedModel = model as Model & ContainedProps

      if (isManuscriptModel(containedModel)) {
        containerIDs.manuscriptID = data.manuscriptID
      }

      const newModel = {
        ...containedModel,
        ...containerIDs,
      }
      modelMap.set(containedModel._id, newModel)
    }

    return new Promise<void>((resolve, reject) => {
      saveWithThrottle(async () => {
        updateState({
          savingProcess: 'saving',
        })
        const result = await bulkPersistentManuscriptSave([
          ...modelMap.values(),
        ] as ManuscriptModel[])

        if (result) {
          resolve()
        } else {
          reject()
        }

        updateState({
          savingProcess: result ? 'saved' : 'failed',
        })
      })
    })
  }

  return {
    saveModel,
    deleteModel,
    saveManuscript,
    getModel,
    bulkUpdate,
  }
}
export default buildUtilities
