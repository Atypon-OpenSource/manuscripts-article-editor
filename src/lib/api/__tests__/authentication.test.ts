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

import { stringify } from 'qs'
import client from '../../client'
import deviceId from '../../device-id'
import {
  changePassword,
  deleteAccount,
  login,
  logout,
  refresh,
  refreshSyncSessions,
  resendVerificationEmail,
  resetPassword,
  sendPasswordRecovery,
  signup,
  verify,
} from '../authentication'

jest.mock('../../device-id')

jest.mock('../../../config', () => ({
  api: { headers: { 'manuscripts-app-id': 'test-app' } },
}))

describe('authentication', () => {
  test('reset password', async () => {
    const password = 'a password'
    const token = 'a token'

    await resetPassword(password, token)

    expect(client.post).toBeCalledWith(
      '/auth/resetPassword',
      {
        deviceId,
        password,
        token,
      },
      {
        headers: { 'manuscripts-app-id': 'test-app' },
        withCredentials: true,
      }
    )
  })

  test('verify', async () => {
    const token = 'a token'
    await verify(token)

    expect(client.post).toBeCalledWith('/registration/verify', {
      token,
    })
  })

  test('resend verification email', async () => {
    const email = 'email'
    await resendVerificationEmail(email)

    expect(client.post).toBeCalledWith('/registration/verify/resend', {
      email,
    })
  })

  test('login', async () => {
    const password = 'a password'
    const email = 'email'

    await login(email, password)

    expect(client.post).toBeCalledWith(
      '/auth/login',
      {
        email,
        password,
        deviceId,
      },
      {
        headers: { 'manuscripts-app-id': 'test-app' },
        withCredentials: true,
      }
    )
  })

  test('signup', async () => {
    const name = 'name'
    const email = 'email'
    const password = 'a password'

    await signup(name, email, password)

    expect(client.post).toBeCalledWith('/registration/signup', {
      name,
      email,
      password,
    })
  })

  test('change password', async () => {
    const currentPassword = 'current password'
    const newPassword = 'new password'

    await changePassword(currentPassword, newPassword)

    expect(client.post).toBeCalledWith('/auth/changePassword', {
      currentPassword,
      newPassword,
      deviceId,
    })
  })

  test('forgot password', async () => {
    const email = 'email'
    await sendPasswordRecovery(email)

    expect(client.post).toBeCalledWith('/auth/sendForgottenPassword', {
      email,
    })
  })

  test('logout', async () => {
    await logout()
    expect(client.post).toBeCalledWith('/auth/logout')
  })

  test('refresh sync sessions', async () => {
    await refreshSyncSessions()
    expect(client.post).toBeCalledWith('/auth/refreshSyncSessions', null, {
      withCredentials: true,
    })
  })

  test('delete user account', async () => {
    const password = 'password'
    await deleteAccount(password)

    expect(client.delete).toBeCalledWith(`/user`, {
      data: { password, deviceId },
    })
  })

  test('refresh', async () => {
    await refresh()

    expect(client.request).toBeCalledWith({
      url: '/token',
      method: 'POST',
      data: stringify({
        grant_type: 'refresh',
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  })
})
