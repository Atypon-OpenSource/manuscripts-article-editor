import axios from 'axios'
import { WayfConfiguration } from '../config'

export const registerWayfId = async (
  token: string,
  config: WayfConfiguration
) => {
  if (!config.url || !config.key) {
    return null
  }

  const localId = JSON.parse(atob(token.split('.')[1])).wayfLocal
  if (!localId) {
    return null
  }

  return axios.patch(config.url + localId, null, {
    headers: {
      Authorization: `Bearer ${config.key}`,
    },
  })
}
