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

import axios, { AxiosResponse, ResponseType } from 'axios'
import config from '../config'
import tokenHandler from '../lib/token'
import { ExportBibliographyFormat, ExportManuscriptFormat } from './exporter'

const client = axios.create({
  baseURL: config.pressroom.url,
})

client.interceptors.request.use(requestConfig => {
  const token = tokenHandler.get()

  if (config.pressroom.key) {
    requestConfig.headers['Pressroom-API-Key'] = config.pressroom.key
  } else if (token) {
    requestConfig.headers.Authorization = 'Bearer ' + token
  }

  return requestConfig
})

const validateResponse = (response: AxiosResponse) => {
  switch (response.status) {
    case 200:
      break

    // TODO: handle authentication failure (401), timeout, too large, etc

    default:
      console.log(response.headers) // tslint:disable-line:no-console
      console.log(response.data) // tslint:disable-line:no-console
      throw new Error('Something went wrong: ' + response.data)
  }
}

export const convertBibliography = async (
  data: CSL.Data[],
  format: ExportBibliographyFormat
): Promise<Blob> => {
  const response = await client.post<Blob>('/v1/compile/bibliography', data, {
    responseType: 'blob' as ResponseType,
    headers: {
      'Pressroom-Target-Bibliography-Format':
        format === 'mods' ? 'xml' : format,
    },
  })

  validateResponse(response)

  return response.data
}

// TODO: remove this once the endpoints have been merged
const chooseURL = (format: string) => {
  switch (format) {
    case 'do':
    case 'jats':
    case 'pdf-prince':
    case 'submission':
      return '/v1/compile/document/jats'

    default:
      return '/v1/compile/document'
  }
}

export const convert = async (
  data: FormData,
  format: ExportManuscriptFormat,
  headers: { [key: string]: string } = {}
): Promise<Blob> => {
  const file = data.get('file') as File

  if (format !== 'do') {
    headers['Pressroom-Target-File-Extension'] = format
  }

  if (format === 'manuproj') {
    headers['Pressroom-Regenerate-Project-Bundle-Model-Object-IDs'] = '1'

    // Enrich metadata via GROBID if not importing a .manuproj file
    if (!file.name.endsWith('.manuproj')) {
      headers['Pressroom-Enrich-Document-Metadata'] = '1'
      headers['Pressroom-Continue-On-Errors'] = '1'
    }
  }

  if (format === 'jats' && config.extyles.arc.secret) {
    headers['Pressroom-Jats-Document-Processing-Level'] = 'full_text'
    headers['Pressroom-Extylesarc-Secret'] = config.extyles.arc.secret
  }

  const url = chooseURL(format)

  const response = await client.post<Blob>(url, data, {
    responseType: 'blob' as ResponseType,
    headers,
  })

  validateResponse(response)

  return response.data
}
