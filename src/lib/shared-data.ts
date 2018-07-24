import axios from 'axios'
import config from '../config'

export const fetchSharedData = async (filename: string) => {
  const response = await axios.get(config.data.url + '/shared/' + filename)

  return response.data
}
