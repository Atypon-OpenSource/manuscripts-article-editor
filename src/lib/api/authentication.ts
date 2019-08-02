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

export const deleteAccount = (password: string) =>
  client.delete('/user', {
    data: { password, deviceId },
  })

export const logout = () => client.post('/auth/logout')

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
