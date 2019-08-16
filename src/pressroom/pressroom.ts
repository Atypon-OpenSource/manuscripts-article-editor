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

import axios from 'axios'
import config from '../config'
import tokenHandler from '../lib/token'

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

export const convert = async (
  form: FormData,
  format: string
): Promise<Blob> => {
  const responseType: XMLHttpRequestResponseType = 'blob'

  const response = await client.post<Blob>('/v1/document/compile', form, {
    responseType,
    headers: {
      'Pressroom-Target-File-Extension': format.replace(/^\./, ''),
      'Pressroom-Regenerate-Project-Bundle-Model-Object-IDs': 1,
    },
  })

  switch (response.status) {
    case 200:
      break

    // TODO: handle authentication failure (401), timeout, too large, etc

    default:
      throw new Error('Something went wrong: ' + response.data)
  }

  return response.data
}
