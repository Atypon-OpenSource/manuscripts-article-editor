import axios from 'axios'
import config from '../config'
import tokenHandler from './token'

const client = axios.create({
  baseURL: config.api.url,
})

client.interceptors.request.use(config => {
  const token = tokenHandler.get()

  config.headers.Accept = 'application/json'
  config.headers['Content-Type'] = 'application/json'
  if (token) {
    config.headers.authorization = 'Bearer ' + token
  }

  return config
})

export default client
