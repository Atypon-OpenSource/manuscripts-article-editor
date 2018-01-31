import { LoginValues } from '../components/LoginForm'
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

export const logout = () =>
  client.delete('/authentication').then(() => {
    token.remove()
  })

// TODO: re-enable these REST actions when they're needed
// export const list = (type: string) => client.get(type)
// export const create = (type: string, data: any) => client.post(type, data)
// export const get = (type: string, id: string) => client.get(`${type}/${id}`)
// export const update = (type: string, id: string, data: any) =>
//   client.patch(`${type}/${id}`, data)
// export const remove = (type: string, id: string) =>
//   client.delete(`${type}/${id}`)
