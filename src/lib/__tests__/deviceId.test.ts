import deviceID from '../device-id'

describe('device ID', () => {
  it('should be set when ../deviceId is imported', () => {
    expect(deviceID).toBeTruthy() // can't really test the local storage version of this
  })
})
