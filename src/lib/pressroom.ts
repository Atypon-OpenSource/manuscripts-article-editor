import axios from 'axios'
import config from '../config'
import token from './token'

const client = axios.create({
  baseURL: config.pressroom.url,
})

client.interceptors.request.use(requestConfig => {
  const tokenData = token.get()

  if (config.pressroom.key) {
    requestConfig.headers['Pressroom-API-Key'] = config.pressroom.key
  } else if (tokenData && tokenData.access_token) {
    requestConfig.headers.Authorization = 'Bearer ' + tokenData.access_token
  }

  return requestConfig
})

export const convert = async (
  form: FormData,
  format: string
): Promise<Blob> => {
  const responseType: XMLHttpRequestResponseType = 'blob'

  const response = await client.post('/v1/document/compile', form, {
    responseType,
    headers: {
      'Pressroom-Target-File-Extension': format.replace(/^\./, ''),
    },
  })

  switch (response.status) {
    case 200:
      break

    // TODO: handle authentication failure (401), timeout, too large, etc

    default:
      throw new Error('Something went wrong: ' + response.data)
  }

  return response.data
}
