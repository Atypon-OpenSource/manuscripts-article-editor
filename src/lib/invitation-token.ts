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

const storage = window.localStorage

export const INVITATION_TOKEN_KEY = 'invitationToken'

export default {
  get: () => storage.getItem(INVITATION_TOKEN_KEY),
  set: (token: string) => {
    storage.setItem(INVITATION_TOKEN_KEY, token)

    return token
  },
  remove: () => storage.removeItem(INVITATION_TOKEN_KEY),
}
