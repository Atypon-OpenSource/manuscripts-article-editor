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
  ModelAttachment,
} from '@manuscripts/manuscript-transform'
import { Bundle, Manuscript, Model } from '@manuscripts/manuscripts-json-schema'
import React, { useCallback, useContext, useState } from 'react'

import { Collection, ContainerIDs } from '../sync/Collection'
import collectionManager from '../sync/CollectionManager'

type ModelMap = Map<string, Model>

interface Props {
  modelMap: ModelMap
  containerID: string
  manuscriptID: string
}

interface ManuscriptModels {
  getModel: <T extends Model>(id: string) => T | undefined
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  deleteModel: (id: string) => Promise<string>
  bundle: Bundle | null
  collection: Collection<ContainedModel>
  containerID: string
  manuscriptID: string
  modelMap: ModelMap
}

const ManuscriptModelsContext = React.createContext<ManuscriptModels | null>(
  null
)

export const ManuscriptModelsProvider: React.FC<Props> = ({
  modelMap,
  containerID,
  manuscriptID,
  children,
}) => {
  const collection = collectionManager.getCollection(
    `project-${containerID}`
  ) as Collection<ContainedModel>
  const manuscript = modelMap.get(manuscriptID) as Manuscript
  const bundle = manuscript.bundle // TODO: infer bundle from prototype if manuscript.bundle is undefined ?
    ? (modelMap.get(manuscript.bundle) as Bundle)
    : null

  const [modelsState, setModelsState] = useState<ModelMap>(modelMap)

  const getModel = useCallback(
    <T extends Model>(id: string) => {
      if (!modelsState) {
        return
      }
      return modelsState.get(id) as T | undefined
    },
    [modelsState]
  )

  const saveModel = useCallback(
    async <T extends Model>(
      model: T | Build<T> | Partial<T>
    ): Promise<T & ContainedProps> => {
      if (!model._id) {
        throw new Error('Model ID required')
      }

      const containedModel = model as T & ContainedProps

      // NOTE: this is needed because the local state is updated before saving
      const containerIDs: ContainerIDs = {
        containerID,
      }

      if (isManuscriptModel(containedModel)) {
        containerIDs.manuscriptID = manuscriptID
      }

      // NOTE: can't set a partial here
      if (modelsState) {
        setModelsState((prev) =>
          new Map(prev).set(containedModel._id, {
            ...containedModel,
            ...containerIDs,
          })
        )
      }

      const { attachment, ...data } = containedModel as T &
        ContainedProps &
        ModelAttachment

      // TODO: data.contents = serialized DOM wrapper for bibliography

      const result = await collection.save(data, containerIDs)

      if (attachment) {
        await collection.putAttachment(result._id, attachment)
      }

      return result as T & ContainedProps
    },
    [modelsState, collection, containerID, manuscriptID]
  )

  const saveManuscript = useCallback(
    async (data: Partial<Manuscript>) => {
      if (!modelsState) {
        return
      }
      const prevManuscript = modelsState.get(manuscriptID)
      return saveModel({
        ...prevManuscript,
        ...data,
      }).then(() => undefined)
    },
    [modelsState, saveModel, manuscriptID]
  )

  const deleteModel = useCallback(
    (id: string) => {
      if (modelsState) {
        modelsState.delete(id)
      }
      return collection.delete(id)
    },
    [modelsState, collection]
  )

  const value = {
    getModel,
    saveModel,
    modelMap: modelsState,
    saveManuscript,
    deleteModel,
    collection,
    bundle,
    containerID,
    manuscriptID,
  }

  return (
    <ManuscriptModelsContext.Provider value={value}>
      {children}
    </ManuscriptModelsContext.Provider>
  )
}

export const useManuscriptModels = () => {
  const data = useContext(ManuscriptModelsContext)
  if (!data) {
    throw new Error('useManuscriptModels taken out of context')
  }

  return data
}
