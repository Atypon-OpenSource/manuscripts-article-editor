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

import tokenHandler from '../token'
import { getCurrentUserId, TokenPayload } from '../user'

jest.mock('../token')

describe('user', () => {
  test('get current user id from token', () => {
    const data: TokenPayload = {
      id: '123456',
      email: 'User_test@example.com',
      deviceID: 'device123',
      aud: 'your-audience',
      iss: 'your-issuer',
      iat: 1616172290,
    }
    const token = ['', btoa(JSON.stringify(data)), ''].join('.')
    tokenHandler.set(token)

    const result = getCurrentUserId()

    expect(result).toBe('123456')

    tokenHandler.remove()
  })

  test('get removed current user id', () => {
    const result = getCurrentUserId()

    expect(result).toBeNull()
  })
})
