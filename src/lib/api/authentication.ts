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
import config from '../../config'
import client from '../client'
import deviceId from '../device-id'

export const signup = (name: string, email: string, password: string) =>
  client.post('/registration/signup', {
    name,
    email,
    password,
  })

export const verify = (token: string) =>
  client.post('/registration/verify', { token })

export const resendVerificationEmail = (email: string) =>
  client.post(`/registration/verify/resend`, { email })

export const sendPasswordRecovery = (email: string) =>
  client.post('/auth/sendForgottenPassword', { email })

export const resetPassword = (password: string, token: string) =>
  client.post<{
    token: string
  }>(
    '/auth/resetPassword',
    {
      password,
      token,
      deviceId,
    },
    {
      headers: config.api.headers,
      withCredentials: true,
    }
  )

export const login = (email: string, password: string) =>
  client.post<{
    token: string
    recover: boolean
  }>(
    '/auth/login',
    {
      email,
      password,
      deviceId,
    },
    {
      headers: config.api.headers,
      withCredentials: true,
    }
  )

export const changePassword = (currentPassword: string, newPassword: string) =>
  client.post<{
    status?: number
  }>('/auth/changePassword', {
    currentPassword,
    newPassword,
    deviceId,
  })

export const refreshSyncSessions = () =>
  client.post('/auth/refreshSyncSessions', null, {
    withCredentials: true,
  })

export const markUserForDeletion = (password?: string) =>
  client.post('/user/mark-for-deletion', {
    password,
  })

export const unmarkUserForDeletion = () =>
  client.post('/user/unmark-for-deletion')

export const logout = () =>
  client.post('/auth/logout', null, {
    withCredentials: true,
  })

export const refresh = () =>
  client.request({
    url: '/token',
    method: 'POST',
    data: stringify({
      grant_type: 'refresh',
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })

export const redirectToConnect = (action?: string) => {
  window.location.assign(
    config.api.url +
      '/auth/iam?' +
      stringify({
        deviceId,
        ...config.api.headers,
        action,
      })
  )
}
