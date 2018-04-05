// import { AccountValues } from '../components/AccountForm'
import { AxiosRequestConfig } from 'axios'
import { stringify } from 'qs'
import { LoginResponse, LoginValues } from '../components/LoginForm'
import {
  PasswordHiddenValues,
  PasswordValues,
  ResetPasswordResponse,
} from '../components/PasswordForm'
import { RecoverValues } from '../components/RecoverForm'
import { SignupValues } from '../components/SignupForm'
import client from './client'
import { Device } from './deviceId'
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

export const authenticate = () => {
  return client.get('/user').then(response => response.data)
}

export const signup = (data: SignupValues) =>
  client.post('/registration/signup', data)

export const login = (data: LoginValues & Device) =>
  client
    .post<LoginResponse>('/auth/login', data, {
      headers: {
        'manuscripts-app-id': process.env.API_APPLICATION_ID,
        'manuscripts-app-secret': process.env.API_APPLICATION_SECRET, // TODO: this should be removed after resolving this https://gitlab.com/mpapp-private/manuscripts-api/issues/82
      },
      withCredentials: true,
    })
    .then(response => {
      token.set({
        access_token: response.data.token,
      })

      return response
    })

export const recoverPassword = (data: RecoverValues) =>
  client.post('/auth/sendForgottenPassword', data)

export const resetPassword = (
  data: PasswordValues & PasswordHiddenValues & Device
) =>
  client
    .post<ResetPasswordResponse>('/auth/resetPassword', data, {
      headers: {
        'manuscripts-app-id': process.env.API_APPLICATION_ID,
        'manuscripts-app-secret': process.env.API_APPLICATION_SECRET, // TODO: this should be removed after resolving this https://gitlab.com/mpapp-private/manuscripts-api/issues/82
      },
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
