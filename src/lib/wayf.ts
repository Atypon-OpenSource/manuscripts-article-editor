import axios from 'axios'
import decode from 'jwt-decode'
import { WayfConfiguration } from '../config'
import { TokenPayload } from './user'

export const registerWayfId = async (
  token: string,
  config: WayfConfiguration
) => {
  if (!config.url || !config.key) {
    return null
  }

  const { wayfLocal } = decode<TokenPayload>(token)

  if (!wayfLocal) {
    return null
  }

  return axios.patch(config.url + wayfLocal, null, {
    headers: {
      Authorization: `Bearer ${config.key}`,
    },
  })
}
