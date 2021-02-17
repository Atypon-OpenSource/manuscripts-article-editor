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

import axios, { AxiosError, AxiosResponse, ResponseType } from 'axios'

import config from '../config'
import { fetchScopedToken } from '../lib/api'
import { ExportManuscriptFormat, ImportManuscriptFormat } from './exporter'

const client = axios.create({
  baseURL: config.pressroom.url,
})

client.interceptors.request.use(async (requestConfig) => {
  const { data: token } = await fetchScopedToken('pressroom-js')

  requestConfig.headers.Authorization = `Bearer ${token}`

  return requestConfig
})

const validateResponse = (response: AxiosResponse) => {
  switch (response.status) {
    case 200:
    case 202:
    case 204:
      break

    // TODO: handle authentication failure (401), timeout, too large, etc

    default:
      console.log(response.headers)
      console.log(response.data)
      throw new Error('Something went wrong: ' + response.data)
  }
}

export const importData = async (
  form: FormData,
  sourceFormat: ImportManuscriptFormat,
  headers = {}
): Promise<Blob> => {
  const response = await client.post<Blob>(`/import/${sourceFormat}`, form, {
    responseType: 'blob' as ResponseType,
    headers,
  })

  validateResponse(response)

  return response.data
}

export const exportData = async (
  form: FormData,
  targetFormat: ExportManuscriptFormat | 'bibliography' | 'word',
  retries = 0
): Promise<Blob> => {
  try {
    if (retries > 0) {
      form.append('allowMissingElements', 'true')
    }

    const response = await client.post<Blob>(`/export/${targetFormat}`, form, {
      responseType: 'blob' as ResponseType,
    })

    validateResponse(response)

    return response.data
  } catch (e: AxiosError | any) {
    if (retries > 0 || e.status !== 400) {
      throw e
    }
    return exportData(form, targetFormat, 1)
  }
}
