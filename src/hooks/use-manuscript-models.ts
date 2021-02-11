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
import { useCallback } from 'react'

import { Collection, ContainerIDs } from '../sync/Collection'
import collectionManager from '../sync/CollectionManager'

type ModelMap = Map<string, Model>

export const useManuscriptModels = (
  modelMap: ModelMap,
  containerID: string,
  manuscriptID: string
) => {
  const collection = collectionManager.getCollection(
    `project-${containerID}`
  ) as Collection<ContainedModel>
  const manuscript = modelMap.get(manuscriptID) as Manuscript
  const bundle = manuscript.bundle
    ? (modelMap.get(manuscript.bundle) as Bundle)
    : null

  const getModel = useCallback(
    <T extends Model>(id: string) => {
      if (!modelMap) {
        return
      }
      return modelMap.get(id) as T | undefined
    },
    [modelMap]
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
      if (modelMap) {
        modelMap.set(containedModel._id, {
          ...containedModel,
          ...containerIDs,
        })
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
    [modelMap, collection, containerID, manuscriptID]
  )

  const saveManuscript = useCallback(
    async (data: Partial<Manuscript>) => {
      if (!modelMap) {
        return
      }
      const prevManuscript = modelMap.get(manuscriptID)
      return saveModel({
        ...prevManuscript,
        ...data,
      }).then(() => undefined)
    },
    [modelMap, saveModel, manuscriptID]
  )

  const deleteModel = useCallback(
    (id: string) => {
      if (modelMap) {
        modelMap.delete(id)
      }
      return collection.delete(id)
    },
    [modelMap, collection]
  )

  return {
    getModel,
    saveModel,
    saveManuscript,
    deleteModel,
    collection,
    bundle,
  }
}
