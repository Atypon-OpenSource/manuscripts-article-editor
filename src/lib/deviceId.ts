import { v4 } from 'uuid'

const DEVICE_ID_KEY = 'deviceId'
const storage = window.localStorage

export interface Device {
  deviceId: string
}

export default {
  get: (): string => {
    let deviceId = storage.getItem(DEVICE_ID_KEY)
    if (deviceId === null) {
      deviceId = v4()
      storage.setItem(DEVICE_ID_KEY, deviceId)
    }

    return deviceId
  },
}
