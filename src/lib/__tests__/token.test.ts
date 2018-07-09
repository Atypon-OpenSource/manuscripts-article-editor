import TokenStore from '../token'

describe('token', () => {
  // all of get, set, remove all in one test call
  // such as to make test ordering not be a factor in success.
  it('get and set', () => {
    expect(TokenStore.get()).toBeFalsy()

    const token = { access_token: 'bar' }
    expect(TokenStore.set(token)).toEqual(token)
    expect(TokenStore.get()).toEqual(token)

    TokenStore.remove()
    expect(TokenStore.get()).toBeFalsy()
  })
})
