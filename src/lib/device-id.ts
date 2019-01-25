import uuid from 'uuid/v4'

export interface DeviceValues {
  deviceId: string
}

const storage = window.localStorage

if (!storage.getItem('deviceId')) {
  storage.setItem('deviceId', uuid())
}

export default storage.getItem('deviceId') as string
