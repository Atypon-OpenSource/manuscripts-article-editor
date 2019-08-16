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

import decode from 'jwt-decode'
import userID from '../lib/user-id'
import * as api from './api'
import { recreateDatabase, removeDatabase } from './db'
import { TokenPayload } from './user'

export const login = async (email: string, password: string) => {
  // TODO: decide whether to remove the local database at login

  const {
    data: { token },
  } = await api.login(email, password)

  try {
    const oldUserId = userID.get()
    const { userId } = decode<TokenPayload>(token)

    if (oldUserId !== userId) {
      await recreateDatabase()
    }
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: removing the local database failed
  }

  return token
}

export const logout = async () => {
  try {
    await api.logout()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: request to the API server failed
  }

  try {
    await removeDatabase()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: removing the local database failed
  }

  // TODO: clear localStorage
}

export const resetPassword = async (
  password: string,
  verificationToken: string
) => {
  const {
    data: { token },
  } = await api.resetPassword(password, verificationToken)

  return token
}
