import axios from 'axios'
import token from './token'

const client = axios.create({
  baseURL: process.env.API_BASE_URL,
})

client.interceptors.request.use(config => {
  const tokenData = token.get()

  if (tokenData) {
    config.headers.authorization = 'Bearer ' + tokenData.access_token
  }

  return config
})

export default client
