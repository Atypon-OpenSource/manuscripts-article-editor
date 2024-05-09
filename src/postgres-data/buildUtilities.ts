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
} from '@manuscripts/transform'

import Api from '../postgres-data/Api'
import { ContainerIDs, state } from '../store'
import { saveWithThrottle } from './savingUtilities'

export const buildUtilities = (
  getState: () => Partial<state>,
  updateState: (state: Partial<state>) => void,
  api: Api
) => {
  const getModel = <T extends Model>(id: string) => {
    const state = getState()
    if (!state.modelMap) {
      return
    }
    return state.modelMap.get(id) as T | undefined
  }

  const saveModels = async (models: Model[]) => {
    const state = getState()

    if (state.projectID && state.manuscriptID) {
      try {
        const filtered = models.filter(
          (m) => m.objectType !== ObjectTypes.Project
        )
        await api.saveProject(state.projectID, filtered)
        return true
      } catch (e) {
        return false
      }
    }
    return false
  }

  const saveModel = async <T extends Model>(
    model: T | Build<T> | Partial<T>
  ) => {
    if (!model._id) {
      throw new Error('Model ID required')
    }

    const state = getState()
    if (!state.modelMap || !state.manuscriptID || !state.projectID) {
      throw new Error('Unable to save model due to incomplete data')
    }

    const containedModel = model as T & ContainedProps

    // NOTE: this is needed because the local state is updated before saving
    const containerIDs: ContainerIDs = {
      containerID: state.projectID,
    }

    if (isManuscriptModel(containedModel)) {
      containerIDs.manuscriptID = state.manuscriptID
    }

    const newModel = {
      ...containedModel,
      ...containerIDs,
    }

    const modelMap = new Map(state.modelMap)
    modelMap.set(containedModel._id, newModel)

    updateState({
      modelMap,
      preventUnload: true,
    })

    saveWithThrottle(async () => {
      updateState({
        savingProcess: 'saving',
      })
      const result = await saveModels([...modelMap.values()])

      updateState({
        savingProcess: result ? 'saved' : 'failed',
        preventUnload: false,
      })
    })
    return newModel
  }

  const deleteModel = async (id: string) => {
    const state = getState()
    if (state.modelMap) {
      const modelMap = new Map(state.modelMap)
      modelMap.delete(id)

      updateState({
        modelMap: modelMap,
        savingProcess: 'saving',
      })
      const result = await saveModels([...modelMap.values()])
      updateState({
        savingProcess: result ? 'saved' : 'failed',
      })
    }

    return id
  }

  const saveManuscript = async (manuscriptData: Partial<Manuscript>) => {
    const state = getState()
    if (!state.modelMap || !state.manuscriptID) {
      throw new Error('Unable to save manuscript due to incomplete data')
    }
    const prevManuscript = state.modelMap.get(state.manuscriptID)
    await saveModel({
      ...prevManuscript,
      ...manuscriptData,
    })
  }

  const bulkUpdate = async (
    items: ContainedModel[] | Build<Model>[] | Partial<Model>[]
  ) => {
    const state = getState()

    if (!state.modelMap || !state.manuscriptID || !state.projectID) {
      throw new Error('Unable to save due to incomplete data')
    }

    const nonPMModelsTypes = [ObjectTypes.Project, ObjectTypes.Manuscript]

    const modelMap = new Map<string, Model>()

    for (const [id, oldModel] of state.modelMap) {
      if (nonPMModelsTypes.some((t) => t == oldModel.objectType)) {
        modelMap.set(id, oldModel)
      }
    }

    for (const model of items) {
      // NOTE: this is needed because the local state is updated before saving
      const containerIDs: ContainerIDs = {
        containerID: state.projectID,
      }

      if (!model._id) {
        throw new Error('Model ID required')
      }

      const containedModel = model as Model & ContainedProps

      if (isManuscriptModel(containedModel)) {
        containerIDs.manuscriptID = state.manuscriptID
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
        const result = await saveModels([...modelMap.values()])

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
