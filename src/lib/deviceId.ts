import uuid from 'uuid'

export interface DeviceValues {
  deviceId: string
}

const storage = window.localStorage

if (!storage.getItem('deviceId')) {
  storage.setItem('deviceId', uuid.v4())
}

export default storage.getItem('deviceId') as string
