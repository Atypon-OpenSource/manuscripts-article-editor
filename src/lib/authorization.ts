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

import { AxiosRequestConfig } from 'axios'
import tokenHandler from './token'

const anonymousRoutes = ['/auth/login', '/registration/signup']

const isAuthenticatedRoute = (url?: string) =>
  url ? !anonymousRoutes.includes(url) : true

export const authorizationInterceptor = (config: AxiosRequestConfig) => {
  if (isAuthenticatedRoute(config.url)) {
    const token = tokenHandler.get()

    if (token) {
      config.headers.authorization = 'Bearer ' + token
    }
  }

  return config
}
