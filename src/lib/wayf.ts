import axios from 'axios'
import config from '../config'

export const registerWayfId = async (token: string) => {
  if (config.wayf.url && config.wayf.key) {
    const localId = JSON.parse(atob(token.split('.')[1])).wayfLocal

    if (localId) {
      return axios.patch(config.wayf.url + localId, null, {
        headers: {
          Authorization: `Bearer ${config.wayf.key}`,
        },
      })
    }
  }
}
