import axios from 'axios'
import token from './token'

const client = axios.create({
  baseURL: process.env.API_BASE_URL,
})

client.interceptors.request.use(config => {
  if (token.get()) {
    config.headers.authorization = 'Bearer ' + token.get()
  }

  return config
})

export default client
