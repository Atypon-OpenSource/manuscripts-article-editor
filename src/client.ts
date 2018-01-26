import axios from 'axios'
import { LoginValues } from './components/LoginForm'
import { SignupValues } from './components/SignupForm'

const baseURL = process.env.API_BASE_URL

const api = axios.create({ baseURL })

api.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token')

  if (token) {
    config.headers.authorization = 'Bearer ' + token
  }

  return config
})

export const authenticate = () =>
  api.get('/authentication').then(response => response.data)

export const signup = (data: SignupValues) =>
  api.post('/authentication/signup', data).then(response => {
    window.localStorage.setItem('token', response.data.token)
  })

export const login = (data: LoginValues) =>
  api.post('/authentication', data).then(response => {
    window.localStorage.setItem('token', response.data.token)
  })

export const logout = () =>
  api.delete('/authentication').then(() => {
    window.localStorage.removeItem('token')
  })

// tslint:disable:no-any

export const list = (type: string) => api.get(type)
export const create = (type: string, data: any) => api.post(type, data)
export const get = (type: string, id: string) => api.get(`${type}/${id}`)
export const update = (type: string, id: string, data: any) =>
  api.patch(`${type}/${id}`, data)
export const remove = (type: string, id: string) => api.delete(`${type}/${id}`)
