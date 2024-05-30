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
  Manuscript,
  manuscriptIDTypes,
  Model,
  ObjectTypes,
} from '@manuscripts/json-schema'
import { Build, encode, ManuscriptNode } from '@manuscripts/transform'

import Api from '../postgres-data/Api'
import { ContainerIDs, state } from '../store'
import { saveWithThrottle } from './savingUtilities'

export const buildUtilities = (
  getState: () => Partial<state>,
  updateState: (state: Partial<state>) => void,
  api: Api
): Partial<state> => {
  const nonPMModelsTypes = new Set([
    ObjectTypes.Manuscript,
    ObjectTypes.Project,
  ])

  const updateContainerIDs = (
    model: Model,
    projectID: string,
    manuscriptID: string
  ) => {
    const containerIDs: ContainerIDs = {
      containerID: projectID,
    }

    if (!model._id) {
      throw new Error('Model ID required')
    }

    if (manuscriptIDTypes.has(model.objectType)) {
      containerIDs.manuscriptID = manuscriptID
    }

    return {
      ...model,
      ...containerIDs,
    }
  }

  const saveProject = async (models: Model[], projectID: string) => {
    try {
      const filtered = models.filter(
        (m) => m.objectType !== ObjectTypes.Project
      )
      await api.saveProject(projectID, filtered)
      return true
    } catch (e) {
      return false
    }
  }

  const getModel = <T extends Model>(id: string) => {
    const state = getState()
    if (!state.modelMap) {
      return
    }
    return state.modelMap.get(id) as T | undefined
  }

  const saveModels = async (
    models: Model[] | Build<Model>[] | Partial<Model>[],
    excludeIDs?: Set<string>
  ) => {
    const state = getState()
    const projectID = state.projectID
    const manuscriptID = state.manuscriptID

    if (!state.modelMap || !manuscriptID || !projectID) {
      throw new Error('Unable to save due to incomplete data')
    }

    const modelMap = new Map<string, Model>()

    for (const [id, model] of state.modelMap) {
      const type = model.objectType as ObjectTypes
      if (nonPMModelsTypes.has(type) || !excludeIDs?.has(id)) {
        modelMap.set(id, model)
      }
    }

    for (const model of models) {
      if (!model._id) {
        throw new Error('Model ID required')
      }
      const updated = updateContainerIDs(
        model as Model,
        projectID,
        manuscriptID
      )
      modelMap.set(model._id, updated)
    }

    updateState({
      modelMap,
      preventUnload: true,
    })

    saveWithThrottle(async () => {
      updateState({
        savingProcess: 'saving',
      })

      const result = await saveProject([...modelMap.values()], projectID)

      updateState({
        savingProcess: result ? 'saved' : 'failed',
        preventUnload: false,
      })
    })
  }

  const saveModel = async <T extends Model>(
    model: T | Build<T> | Partial<T>
  ): Promise<T> => {
    await saveModels([model])
    //is this actually needed?
    return model as T
  }

  const deleteModel = async (id: string) => {
    await saveModels([], new Set([id]))
    return id
  }

  const saveManuscript = async (manuscript: Partial<Manuscript>) => {
    const state = getState()
    if (!state.modelMap || !state.manuscriptID) {
      throw new Error('Unable to save manuscript due to incomplete data')
    }
    const previous = state.modelMap.get(state.manuscriptID)
    await saveModel({
      ...previous,
      ...manuscript,
    })
  }

  const saveDoc = async (doc: ManuscriptNode) => {
    const models = encode(doc)
    await saveModels([...models.values()])
  }

  const createSnapshot = async () => {
    const state = getState()
    const projectID = state.projectID
    const manuscriptID = state.manuscriptID
    const snapshots = state.snapshots
    const snapshotsMap = state.snapshotsMap
    if (!projectID || !manuscriptID || !snapshots || !snapshotsMap) {
      throw new Error('Unable to create snapshot due to incomplete data')
    }
    const data = await api.createSnapshot(projectID, manuscriptID)
    const { snapshot, ...label } = data.snapshot
    updateState({
      snapshots: [...snapshots, label],
      snapshotsMap: snapshotsMap.set(label.id, data.snapshot),
    })
  }

  return {
    saveModel,
    deleteModel,
    saveManuscript,
    getModel,
    saveModels,
    saveDoc,
    createSnapshot,
  }
}
