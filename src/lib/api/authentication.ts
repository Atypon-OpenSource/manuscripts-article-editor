import { stringify } from 'qs'
import config from '../../config'
import client from '../client'
import deviceId from '../deviceId'

export const signup = (
  name: string,
  email: string,
  password: string,
  allowsTracking: boolean
) =>
  client.post('/registration/signup', {
    name,
    email,
    password,
    allowsTracking,
  })

export const verify = (token: string) =>
  client.post('/registration/verify', { token })

export const resendVerificationEmail = (email: string) =>
  client.post(`/registration/verify/resend`, { email })

export const sendPasswordRecovery = (email: string) =>
  client.post('/auth/sendForgottenPassword', {
    email,
  })

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
    data: { password },
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
