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
  isManuscriptModel,
  ManuscriptModel,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Bundle,
  Correction,
  LibraryCollection,
  Manuscript,
  Model,
  ObjectTypes,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Commit, commitToJSON } from '@manuscripts/track-changes'

import Api from '../postgres-data/Api'
import { ContainedIDs, ContainerIDs, state } from '../store'
import { Biblio } from './Bibilo'
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
      api.saveProject(data.projectID, onlyProjectModels)
    }
  }

  const bulkPersistentManuscriptSave = (models: ManuscriptModel[]) => {
    // const onlyManuscriptModels = models.filter((model) => {
    //   return isManuscript(model) || model.manuscriptID === data.manuscriptID
    // })
    const clearedModels = models.filter((model) => {
      return model.objectType !== ObjectTypes.Project
    })
    if (data.projectID && data.manuscriptID) {
      return api
        .saveManuscriptData(data.projectID, data.manuscriptID, clearedModels)
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
    if (!model._id) {
      throw new Error('Model ID required')
    }
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

    const modelMap = data.modelMap.set(containedModel._id, newModel)

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
        modelMap,
      })
      updateState({
        savingProcess: 'pending',
      })
      const result = await bulkPersistentManuscriptSave([
        ...modelMap.values(),
      ] as ManuscriptModel[])
      updateState({
        savingProcess: result ? 'saved' : 'failed',
      })
    })
    return newModel
  }

  const saveProjectModel = <T extends Model>(model: T | Build<T>) => {
    if (!model._id) {
      throw new Error('Model ID required.')
    }
    if (!data.modelMap || !data.projectID) {
      throw new Error(
        'State misses important element. Unable to savel a model.'
      )
    }
    const containedModel = {
      ...model,
      containerID: data.projectID,
    } as T & ContainedProps
    const map = data.modelMap // potential time discrepancy bug

    saveWithThrottle(() => {
      updateState({
        modelMap: map.set(model._id, containedModel),
      })
      if (data.modelMap) {
        bulkPersistentProjectSave([
          ...data.modelMap.values(),
        ] as ManuscriptModel[])
      }
    })

    return containedModel
  }

  const deleteModel = async (id: string) => {
    if (data.modelMap) {
      data.modelMap.delete(id)
      updateState({
        modelMap: data.modelMap,
        savingProcess: 'pending',
      })
      const result = await bulkPersistentManuscriptSave([
        ...data.modelMap.values(),
      ] as ManuscriptModel[])
      updateState({
        savingProcess: result ? 'saved' : 'failed',
      })
    }

    return id
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

  const saveNewManuscript = async (
    // this is only for development purposes, in LW there should be no direct insertion of manuscripts by user
    dependencies: Array<Build<ContainedModel> & ContainedIDs>,
    containerID: string, // ignoring for now because API doesn't support an compulsory containerID
    manuscript: Build<Manuscript>,
    newProject?: Build<Project>
  ) => {
    if (newProject) {
      const project = await api.createProject(newProject.title || 'Untitled')
      if (project) {
        await api.createNewManuscript(project._id, manuscript._id)
        dependencies.forEach((dep) => {
          dep.containerID = project._id
        })
        await api.saveProjectData(project._id, dependencies)
        return manuscript
      } else {
        throw new Error('Unable to create new project')
      }
    }
    // else {
    // currently not supporting multiple manuscripts in a project
    // }
    return Promise.resolve(manuscript)
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
    return Promise.resolve(data.modelMap?.delete(item._id) || false)
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

  const bulkUpdate = async (items: Array<ContainedModel>): Promise<void> => {
    for (const value of items) {
      // @TODO - optimize to save all the models at once or at least throttle
      saveModel(value)
    }
  }

  let biblioUtils

  if (data.manuscript && data.library) {
    const bundle = data.manuscript?.bundle // TODO: infer bundle from prototype if manuscript.bundle is undefined ?
      ? (data?.modelMap?.get(data.manuscript.bundle) as Bundle)
      : null
    biblioUtils = new Biblio(
      bundle,
      data.library,
      data.manuscript.primaryLanguageCode || 'eng'
    )
  }

  const createUser = async (profile: Build<UserProfile>) => {
    await saveModel(profile)
    return Promise.resolve()
  }

  return {
    saveModel,
    deleteModel,
    saveManuscript,
    saveNewManuscript,
    getModel,
    saveCommit,
    saveCorrection,
    createProjectLibraryCollection,
    saveBiblioItem,
    deleteBiblioItem,
    updateBiblioItem,
    bulkUpdate,
    createUser,
    biblio: biblioUtils?.getTools(),
  }
}

export default buildUtilities
