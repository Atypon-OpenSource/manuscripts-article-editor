import client from '../../client'
import deviceId from '../../deviceId'
import { resetPassword } from '../authentication'

jest.mock('../../deviceId')

jest.mock('../../client', () => ({
  post: jest.fn(),
}))

jest.mock('../../../config', () => ({
  api: { headers: { 'manuscripts-app-id': 'test-app' } },
}))

describe('authentication', () => {
  test('reset password', async () => {
    const password = 'a password'
    const token = 'a token'

    await resetPassword(password, token)

    expect(client.post).toBeCalledWith(
      '/auth/resetPassword',
      {
        deviceId,
        password,
        token,
      },
      {
        headers: { 'manuscripts-app-id': 'test-app' },
        withCredentials: true,
      }
    )
  })
})
