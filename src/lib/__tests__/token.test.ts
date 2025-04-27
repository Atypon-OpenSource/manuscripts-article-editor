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

import { TokenHandler, TokenPayload } from '../token'
jest.mock('../../config', () => ({
  getConfig: jest.fn(() => ({
    authenticate: 'mock-endpoint',
  })),
}))

describe('token', () => {
  // all of get, set, remove all in one test call
  // such as to make test ordering not be a factor in success.
  const data: TokenPayload = {
    userID: '123456',
    email: 'User_test@example.com',
    deviceID: 'device123',
    aud: 'your-audience',
    iss: 'your-issuer',
    iat: 1616172290,
    exp: 1744296871,
  }
  const token = ['', btoa(JSON.stringify(data)), ''].join('.')
  it('get and set', () => {
    expect(TokenHandler.get()).toBeFalsy()

    expect(TokenHandler.set(token)).toEqual(token)
    expect(TokenHandler.get()).toEqual(token)

    TokenHandler.remove()
    expect(TokenHandler.get()).toBe(null)
  })
})
