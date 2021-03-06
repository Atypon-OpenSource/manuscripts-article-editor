/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import {
  Build,
  encode,
  ManuscriptNode,
} from '@manuscripts/manuscript-transform'
import { Model } from '@manuscripts/manuscripts-json-schema'
import isEqual from 'lodash-es/isEqual'
import create from 'zustand'
import { combine } from 'zustand/middleware'

// import { state } from '../store'

export type Ok<T> = {
  data: T
}
export type Error = {
  err: string
  code: number
}
export type Maybe<T> = Ok<T> | Error

const EXCLUDED_KEYS = [
  'id',
  '_id',
  '_rev',
  '_revisions',
  'sessionID',
  'createdAt',
  'updatedAt',
  'owners',
  'manuscriptID',
  'containerID',
  'src',
  'minWordCountRequirement',
  'maxWordCountRequirement',
  'minCharacterCountRequirement',
  'maxCharacterCountRequirement',
] as (keyof Model)[]

const hasChanged = (a: Model, b: Model): boolean => {
  return !!Object.keys(a).find((key: keyof Model) => {
    if (EXCLUDED_KEYS.includes(key)) {
      return false
    }
    return !isEqual(a[key], b[key])
  })
}

interface PouchState {
  getModels?: () => Map<string, Model> | undefined
  saveModel?: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
}

export const usePouchStore = create(
  combine({} as PouchState, (set, get) => ({
    init(state: PouchState) {
      set(state)
    },
    saveDoc: async (doc: ManuscriptNode): Promise<Maybe<boolean>> => {
      const { getModels, saveModel } = get()
      if (!getModels || !saveModel) {
        return { err: 'usePouchStore not initialized', code: 500 }
      }
      const modelMap = getModels()
      if (!modelMap) {
        return { err: 'modelMap undefined inside usePouchStore', code: 500 }
      }
      const models = encode(doc)
      let errored: Model | undefined
      for (const model of models.values()) {
        const oldModel = modelMap.get(model._id)
        try {
          if (!oldModel) {
            await saveModel(model)
          } else if (hasChanged(model, oldModel)) {
            const nextModel = {
              ...oldModel,
              ...model,
            }
            await saveModel(nextModel)
          }
        } catch (e) {
          errored = oldModel
        }
      }
      if (errored) {
        return { err: `Failed to save model: ${errored}`, code: 500 }
      }
      return { data: true }
    },
  }))
)
