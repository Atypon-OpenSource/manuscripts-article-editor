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

import { Model } from '@manuscripts/json-schema'
import { ContainedModel, encode, ManuscriptNode } from '@manuscripts/transform'
import { isEqual } from 'lodash'
import { useRef } from 'react'

let throttled = () => null
let timeout: number

export const saveWithThrottle = (
  fn: () => any,
  interval = 4000,
  flush = false
) => {
  throttled = fn
  const action = () => {
    throttled()
    window.clearTimeout(timeout)
    timeout = 0
  }
  if (flush) {
    action()
    return
  }
  if (!timeout) {
    timeout = window.setTimeout(() => {
      action()
    }, interval)
  }
}

export const useDoWithThrottle = () => {
  const throttled = useRef(() => null)
  const timeout = useRef<number>()

  const doWithThrottle = (fn: () => any, interval = 4000) => {
    throttled.current = fn
    if (!timeout.current) {
      throttled.current()
      throttled.current = () => {
        return null
      }
      timeout.current = window.setTimeout(() => {
        throttled.current()
        window.clearTimeout(timeout.current)
        timeout.current = 0
      }, interval)
    }
  }

  return doWithThrottle
}

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

export const saveDoc = async (
  doc: ManuscriptNode,
  modelMap: Map<string, Model>,
  bulkUpdate: (models: ContainedModel[]) => Promise<void>
): Promise<Maybe<boolean>> => {
  if (!modelMap) {
    return {
      err: 'modelMap undefined inside usePouchStore',
      code: 500,
    }
  }
  const models = encode(doc)

  const newModelMap = new Map()
  for (const model of models.values()) {
    const oldModel = modelMap.get(model._id)

    if (!oldModel) {
      newModelMap.set(model._id, model)
    } else if (hasChanged(model, oldModel)) {
      const nextModel = {
        ...oldModel,
        ...model,
      }
      newModelMap.set(nextModel._id, nextModel)
    }
  }
  try {
    await bulkUpdate([...newModelMap.values()])
    return { data: true }
  } catch (e) {
    return { err: `Failed to save model: ${e}`, code: 500 }
  }
}
