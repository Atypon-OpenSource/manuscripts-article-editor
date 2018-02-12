import { LoginValues } from '../components/LoginForm'
import {
  PasswordHiddenValues,
  PasswordValues,
} from '../components/PasswordForm'
import { SendPasswordResetValues } from '../components/SendPasswordResetForm'
import { SignupValues } from '../components/SignupForm'
import client from './client'
import token from './token'

export const authenticate = () =>
  client.get('/authentication').then(response => response.data)

export const signup = (data: SignupValues) =>
  client.post('/authentication/signup', data).then(response => {
    token.set(response.data.token)
  })

export const login = (data: LoginValues) =>
  client.post('/authentication', data).then(response => {
    token.set(response.data.token)
  })

export const sendPasswordReset = (data: SendPasswordResetValues) =>
  client.post('/authentication/send-password-reset', data)

export const password = (data: PasswordValues & PasswordHiddenValues) =>
  client.post('/authentication/password', data).then(response => {
    token.set(response.data.token)
  })

export const logout = () =>
  client.delete('/authentication').then(() => {
    token.remove()
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
