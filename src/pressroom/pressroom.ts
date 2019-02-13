/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
