// import { AccountValues } from '../components/AccountForm'
import { AxiosRequestConfig } from 'axios'
import { stringify } from 'qs'
import { LoginValues } from '../components/LoginForm'
import { RecoverValues } from '../components/RecoverForm'
import { SignupValues } from '../components/SignupForm'
import client from './client'
import token from './token'

export interface VerifyValues {
  type: 'signup' | 'recovery'
  token: string
  password?: string
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

// NOTE: this will be replaced by a database connection
export const authenticate = () => {
  // return client.get('/user').then(response => response.data)

  // uncomment the line below to be an anonymous user
  return Promise.resolve(undefined)

  // or uncomment the line below to be signed in
  // return Promise.resolve({ id: '123', name: 'Temporary', surname: 'Person' })
}

export const signup = (data: SignupValues) => client.post('/signup', data)

export const login = (data: LoginValues) => {
  const requestConfig = buildFormRequestConfig('/token', {
    username: data.email,
    password: data.password,
    grant_type: 'password',
  })

  return client.request(requestConfig).then(response => {
    token.set(response.data)
  })
}

export const refresh = () => {
  const tokenData = token.get()

  if (!tokenData) return Promise.resolve()

  const requestConfig = buildFormRequestConfig('/token', {
    refresh_token: tokenData.refresh_token,
    grant_type: 'refresh',
  })

  return client.request(requestConfig).then(response => {
    token.set(response.data)
  })
}

export const recover = (data: RecoverValues) => client.post('/recover', data)

export const logout = () =>
  client.post('/logout').then(() => {
    token.remove()
  })

export const verify = (data: VerifyValues) =>
  client.post('/verify', data).then(response => {
    token.set(response.data)
  })

/* tslint:disable:no-any */

export const list = (type: string) =>
  client.get(type).then(response => response.data)

export const create = (type: string, data: any) =>
  client.post(type, data).then(response => response.data)

export const get = (type: string, id: string) =>
  client.get(`${type}/${id}`).then(response => response.data)

export const update = (type: string, id: string, data: any) =>
  client.patch(`${type}/${id}`, data).then(response => response.data)

export const remove = (type: string, id: string) =>
  client.delete(`${type}/${id}`).then(response => response.data)
