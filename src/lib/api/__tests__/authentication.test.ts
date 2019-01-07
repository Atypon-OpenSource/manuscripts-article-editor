import { stringify } from 'qs'
import client from '../../client'
import deviceId from '../../deviceId'
import {
  changePassword,
  deleteAccount,
  login,
  logout,
  refresh,
  refreshSyncSessions,
  resendVerificationEmail,
  resetPassword,
  sendPasswordRecovery,
  signup,
  verify,
} from '../authentication'

jest.mock('../../deviceId')

jest.mock('../../client', () => ({
  post: jest.fn(),
  delete: jest.fn(),
  request: jest.fn(),
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

  test('verify', async () => {
    const token = 'a token'
    await verify(token)

    expect(client.post).toBeCalledWith('/registration/verify', {
      token,
    })
  })

  test('resend verification email', async () => {
    const email = 'email'
    await resendVerificationEmail(email)

    expect(client.post).toBeCalledWith('/registration/verify/resend', {
      email,
    })
  })

  test('login', async () => {
    const password = 'a password'
    const email = 'email'

    await login(email, password)

    expect(client.post).toBeCalledWith(
      '/auth/login',
      {
        email,
        password,
        deviceId,
      },
      {
        headers: { 'manuscripts-app-id': 'test-app' },
        withCredentials: true,
      }
    )
  })

  test('signup', async () => {
    const name = 'name'
    const email = 'email'
    const password = 'a password'
    const allowsTracking = false

    await signup(name, email, password, allowsTracking)

    expect(client.post).toBeCalledWith('/registration/signup', {
      name,
      email,
      password,
      allowsTracking,
    })
  })

  test('change password', async () => {
    const currentPassword = 'current password'
    const newPassword = 'new password'

    await changePassword(currentPassword, newPassword)

    expect(client.post).toBeCalledWith('/auth/changePassword', {
      currentPassword,
      newPassword,
      deviceId,
    })
  })

  test('forgot password', async () => {
    const email = 'email'
    await sendPasswordRecovery(email)

    expect(client.post).toBeCalledWith('/auth/sendForgottenPassword', {
      email,
    })
  })

  test('logout', async () => {
    await logout()
    expect(client.post).toBeCalledWith('/auth/logout')
  })

  test('refresh sync sessions', async () => {
    await refreshSyncSessions()
    expect(client.post).toBeCalledWith('/auth/refreshSyncSessions', null, {
      withCredentials: true,
    })
  })

  test('delete user account', async () => {
    const password = 'password'
    await deleteAccount(password)

    expect(client.delete).toBeCalledWith(`/user`, {
      data: { password, deviceId },
    })
  })

  test('refresh', async () => {
    await refresh()

    expect(client.request).toBeCalledWith({
      url: '/token',
      method: 'POST',
      data: stringify({
        grant_type: 'refresh',
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  })
})
