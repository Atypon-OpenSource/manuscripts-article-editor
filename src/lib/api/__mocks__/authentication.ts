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

import { ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import uuid from 'uuid/v4'
import { TokenPayload } from '../../user'

export const login = async (email: string, password: string) => {
  // mock login request: respond with token
  const data: TokenPayload = {
    expiry: +new Date() + 10000,
    userId: 'User|test@example.com',
    userProfileId: `${ObjectTypes.UserProfile}:${uuid()}`,
  }

  return {
    data: {
      token: ['', btoa(JSON.stringify(data)), ''].join('.'),
    },
  }
}

export const logout = async () => {
  // mock logout request: no response data
}

export const resetPassword = async (email: string, token: string) => {
  // mock reset password request: respond with token

  return {
    data: {
      token: '123',
    },
  }
}
