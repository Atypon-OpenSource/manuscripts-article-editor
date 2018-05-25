// import { AccountValues } from '../components/AccountForm'
import { AxiosRequestConfig } from 'axios'
import { stringify } from 'qs'
import { AccountValues, UpdateAccountResponse } from '../components/AccountForm'
import { LoginResponse, LoginValues } from '../components/LoginForm'
import {
  PasswordHiddenValues,
  PasswordValues,
  ResetPasswordResponse,
} from '../components/PasswordForm'
import { RecoverValues } from '../components/RecoverForm'
import { SignupValues } from '../components/SignupForm'
import client from './client'
import { DeviceValues } from './deviceId'
import { applicationHeaders } from './headers'
import token from './token'

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
      headers: applicationHeaders,
      withCredentials: true,
    })
    .then(response => {
      token.set({
        access_token: response.data.token,
      })

      return response
    })

export const updateAccount = (data: AccountValues) =>
  client.post<UpdateAccountResponse>('/account', data, {
    headers: applicationHeaders,
    withCredentials: true,
  })

export const deleteAccount = (data: AccountValues) =>
  client.post<UpdateAccountResponse>('/account', data, {
    headers: applicationHeaders,
    withCredentials: true,
  })

export const recoverPassword = (data: RecoverValues) =>
  client.post('/auth/sendForgottenPassword', data)

export const resetPassword = (
  data: PasswordValues & PasswordHiddenValues & DeviceValues
) =>
  client
    .post<ResetPasswordResponse>('/auth/resetPassword', data, {
      headers: applicationHeaders,
      withCredentials: true,
    })
    .then(response => {
      token.set({
        access_token: response.data.token,
      })

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
  return client.post('/auth/refreshSyncSession', null, {
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
