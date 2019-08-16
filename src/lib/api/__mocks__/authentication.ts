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
