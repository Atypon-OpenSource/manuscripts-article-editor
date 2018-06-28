import axios from 'axios'
import config from '../config'
import token from './token'

const client = axios.create({
  baseURL: config.api.url,
})

client.interceptors.request.use(config => {
  const tokenData = token.get()

  config.headers.Accept = 'application/json'
  config.headers['Content-Type'] = 'application/json'
  if (tokenData) {
    config.headers.authorization = 'Bearer ' + tokenData.access_token
  }

  return config
})

export default client
