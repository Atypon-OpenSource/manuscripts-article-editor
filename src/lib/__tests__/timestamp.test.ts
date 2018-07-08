import timestamp from '../timestamp'

describe('timestamp', () => {
  it('function should divide by 1000', () => {
    const origNow = Date.now
    const now = Date.now()
    Date.now = jest.fn().mockImplementationOnce(() => now)
    expect(Math.floor(timestamp())).toEqual(Math.floor(now / 1000))
    Date.now = origNow
  })
})
