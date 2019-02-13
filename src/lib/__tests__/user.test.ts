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

import tokenHandler from '../token'
import { getCurrentUserId, TokenPayload } from '../user'

jest.mock('../token')

describe('user', () => {
  test('get current user id', () => {
    const data: TokenPayload = {
      expiry: +new Date() + 10000,
      userId: 'User|test@example.com',
      userProfileId: 'MPUserProfile:test',
    }

    const token = ['', btoa(JSON.stringify(data)), ''].join('.')

    tokenHandler.set(token)

    const result = getCurrentUserId()

    expect(result).toBe('User_test@example.com')
  })
})
