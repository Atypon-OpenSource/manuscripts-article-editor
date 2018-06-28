// import { AccountValues } from '../components/AccountForm'
import { AxiosRequestConfig } from 'axios'
import { stringify } from 'qs'
import { AccountValues, UpdateAccountResponse } from '../components/AccountForm'
import {
  ChangePasswordResponse,
  ChangePasswordValues,
} from '../components/ChangePasswordForm'
import { LoginResponse, LoginValues } from '../components/LoginForm'
import {
  PasswordHiddenValues,
  PasswordValues,
  ResetPasswordResponse,
} from '../components/PasswordForm'
import { RecoverValues } from '../components/RecoverForm'
import { SignupValues } from '../components/SignupForm'
import config from '../config'
import client from './client'
import { DeviceValues } from './deviceId'
import token from './token'
import { registerWayfId } from './wayf'

export interface VerifyValues {
  token: string
}

/* tslint:disable-next-line:no-any */
const buildFormRequestConfig = (url: string, data: any): AxiosRequestConfig => {
  return {
    url,
    method: 'POST',
    data: stringify(data),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  }
}

export const fetchUser = () => {
  return client.get('/user').then(response => response.data)
}

export const signup = (data: SignupValues) =>
  client.post('/registration/signup', data)

export const login = (data: LoginValues & DeviceValues) =>
  client
    .post<LoginResponse>('/auth/login', data, {
      headers: config.api.headers,
      withCredentials: true,
    })
    .then(response => {
      token.set({
        access_token: response.data.token,
      })

      registerWayfId(response.data.token)

      return response
    })

export const updateAccount = (data: AccountValues) =>
  client.post<UpdateAccountResponse>('/account', data, {
    headers: config.api.headers,
    withCredentials: true,
  })

export const deleteAccount = (data: AccountValues) =>
  client
    .delete('/user', {
      data,
    })
    .then(() => {
      token.remove()
      window.location.href = '/'
    })

export const changePassword = (data: ChangePasswordValues & DeviceValues) =>
  client.post<ChangePasswordResponse>('/auth/changePassword', data)

export const recoverPassword = (data: RecoverValues) =>
  client.post('/auth/sendForgottenPassword', data)

export const resetPassword = (
  data: PasswordValues & PasswordHiddenValues & DeviceValues
) =>
  client
    .post<ResetPasswordResponse>('/auth/resetPassword', data, {
      headers: config.api.headers,
      withCredentials: true,
    })
    .then(response => {
      token.set({
        access_token: response.data.token,
      })

      registerWayfId(response.data.token)

      return response
    })

export const refresh = () => {
  const tokenData = token.get()

  if (!tokenData) return Promise.resolve()

  const requestConfig = buildFormRequestConfig('/token', {
    grant_type: 'refresh',
  })

  return client.request(requestConfig).then(response => {
    token.set(response.data)
  })
}

export const refreshSyncSession = () => {
  return client.post('/auth/refreshSyncSessions', null, {
    withCredentials: true,
  })
}

export const logout = () =>
  client.post('/auth/logout').then(() => {
    token.remove()
  })

export const verify = (data: VerifyValues) =>
  client.post('/registration/verify', data)

export const list = (type: string) =>
  client.get(type).then(response => response.data)

export const create = (type: string, data: object) =>
  client.post(type, data).then(response => response.data)

export const get = (type: string, id: string) =>
  client.get(`${type}/${id}`).then(response => response.data)

export const update = (type: string, id: string, data: object) =>
  client.patch(`${type}/${id}`, data).then(response => response.data)

export const remove = (type: string, id: string) =>
  client.delete(`${type}/${id}`).then(response => response.data)
