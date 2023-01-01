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

import { ModelAttachment } from '@manuscripts/manuscript-transform'
import { Model } from '@manuscripts/manuscripts-json-schema'
import pathParse from 'path-parse'

import { FileExtensionError } from '../lib/errors'

export interface JsonModel extends Model, ModelAttachment {
  bundled?: boolean
  collection?: string
  contentType?: string
}

export interface ProjectDump {
  version: string
  data: JsonModel[]
}

export const openFilePicker = (
  acceptedExtensions: string[],
  multiple = false
): Promise<File[]> =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedExtensions.join(',')
    input.multiple = multiple

    const handleFocus = () => {
      window.removeEventListener('focus', handleFocus)

      // This event is fired before the input's change event,
      // and before the input's FileList has been populated,
      // so a delay is needed.
      window.setTimeout(() => {
        if (!input.files || !input.files.length) {
          resolve([])
        }
      }, 1000)
    }

    // window "focus" event, fired even if the file picker is cancelled.
    window.addEventListener('focus', handleFocus)

    input.addEventListener('change', () => {
      if (input.files && input.files.length) {
        for (const file of input.files) {
          const { ext } = pathParse(file.name)
          const extension = ext.toLowerCase()

          if (!acceptedExtensions.includes(extension)) {
            const error = new FileExtensionError(extension, acceptedExtensions)
            reject(error)
            return
          }
        }

        resolve(Array.from(input.files))
      } else {
        resolve([])
      }
    })

    input.click()
  })
