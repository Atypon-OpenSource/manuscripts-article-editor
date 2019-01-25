import tokenHandler from '../token'
import { getCurrentUserId, TokenPayload } from '../user'

jest.mock('../token')

describe('user', () => {
  test('get current user id', () => {
    const data: TokenPayload = {
      expiry: +new Date() + 10000,
      userId: 'User|test@example.com',
      userProfileId: 'MPUserProfile:test',
    }

    const token = ['', btoa(JSON.stringify(data)), ''].join('.')

    tokenHandler.set(token)

    const result = getCurrentUserId()

    expect(result).toBe('User_test@example.com')
  })
})
