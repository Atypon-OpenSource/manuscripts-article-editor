/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { generateID } from '@manuscripts/manuscript-transform'
import { Model, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import JSZip from 'jszip'

// TODO: handle `prototype`? remove if not present?
export const updateIdentifiers = async (
  data: Model[]
): Promise<Map<string, string>> => {
  const idMap = new Map<string, string>()

  const updateIDs = (item: Model) => {
    const { _id, objectType } = item

    // TODO: ignore items when _bundled is true?
    // TODO: set prototype for bundled objects? add new bundled objects at the end?
    if (!objectType || !_id || !_id.match(/^MP.+:.+/)) {
      return
    }

    if (idMap.has(_id)) {
      item._id = idMap.get(_id) as string
    } else {
      item._id = generateID(objectType as ObjectTypes)

      idMap.set(_id, item._id)
    }

    // TODO: avoid infinite loops
    for (const value of Object.values(item)) {
      if (Array.isArray(value)) {
        value.forEach(updateIDs)
      } else {
        updateIDs(value)
      }
    }
  }

  const replaceContent = (content: string) => {
    // replace ids with colon separator
    content = content.replace(/MP\w+:[\w-]+/g, (match) => {
      const value = idMap.get(match)

      return value ?? match
    })

    // replace ids with underscore separator
    content = content.replace(/MP\w+_[\w-]+/g, (match) => {
      const value = idMap.get(match.replace('_', ':'))

      return value ? value.replace(':', '_') : match
    })

    return content
  }

  const updateContent = (item: Model | Record<string, unknown>) => {
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'object') {
        updateContent(value as Record<string, unknown>)
      } else if (typeof value === 'string') {
        // @ts-ignore
        item[key] = replaceContent(value)
      }
    }
  }

  for (const item of data) {
    updateIDs(item)
  }

  for (const item of data) {
    updateContent(item)
  }

  // TODO: delete _rev, bundled, locked, sessionID?

  return idMap
}

export const updateAttachmentPath = (
  oldPath: string,
  idMap: Map<string, string>
): string | undefined => {
  const matches = oldPath.match(/^Data\/([^.]+)(.*)/)

  if (matches) {
    const [, prefix, suffix] = matches

    const id = idMap.get(prefix.replace('_', ':'))

    if (id) {
      const newPrefix = id.replace(':', '_')

      return `Data/${newPrefix}${suffix}`
    }
  }
}

export const updateAttachments = async (
  zip: JSZip,
  idMap: Map<string, string>
) => {
  for (const [oldPath, entry] of Object.entries(zip.files)) {
    const newPath = updateAttachmentPath(oldPath, idMap)

    if (newPath) {
      zip.file(newPath, await entry.async('blob')).remove(oldPath)
    }
  }
}
