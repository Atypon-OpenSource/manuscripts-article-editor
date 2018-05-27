jest.mock('../token')

import MockAdapter from 'axios-mock-adapter'
import * as HttpStatusCodes from 'http-status-codes'
import * as api from '../api'
import client from '../client'
import token, { Token } from '../token'

describe('api', () => {
  afterEach(() => {
    token.remove()
  })

  it.skip('returns data from authenticate', async () => {
    const mock = new MockAdapter(client)

    const mockData = {
      name: 'foo',
    }

    mock.onGet('/user').reply(HttpStatusCodes.OK, mockData)

    const noTokenResult = await api.authenticate()

    expect(noTokenResult).toEqual(null)

    const tokenData = {
      access_token: 'foo',
    }

    token.set(tokenData)

    const tokenResult = await api.authenticate()

    expect(tokenResult).toEqual(mockData)
  })

  it('returns data from signup', async () => {
    const mock = new MockAdapter(client)

    mock.onPost('/registration/signup').reply(HttpStatusCodes.OK)

    const result = await api.signup({
      name: 'foo',
      email: 'test@example.com',
      password: 'foo-min-length-8',
    })

    expect(result.status).toEqual(HttpStatusCodes.OK)
  })

  it('stores the token after login', async () => {
    const mock = new MockAdapter(client)

    const mockData = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiVXNlcnx2YWxpZC11c2VyQG1hbnVzY3JpcHRzYXBwLmNvbStkZXZpY2VJZCIsInVzZXJJZCI6IlVzZXJ8dmFsaWQtdXNlckBtYW51c2NyaXB0c2FwcC5jb20iLCJhcHBJZCI6IkFwcGxpY2F0aW9ufDlhOTA5MGQ5LTZmOTUtNDIwYy1iOTAzLTU0M2YzMmI1MTQwZiIsIndheWZMb2NhbCI6IjcwNjc2M2UxLTc5ZmEtNGQxMS1iZjFlLWM1YjRiYjM5NTM4NSIsImlhdCI6MTUyNzE2NzUxN30._HHz4Sc23w_UQUHr6KqFGDGCw--t8maYjtmvULC2iKc',
    }

    mock.onPost('/auth/login').reply(HttpStatusCodes.OK, mockData)

    expect(token.get()).toBeNull()

    await api.login({
      email: 'test@example.com',
      password: 'foo',
      deviceId: 'bar',
    })

    const tokenData = token.get() as Token

    expect(tokenData.access_token).toEqual(mockData.token)
  })

  it('removes the token after logout', async () => {
    const mock = new MockAdapter(client)

    mock.onPost('/auth/logout').reply(HttpStatusCodes.NO_CONTENT)

    const tokenData = {
      access_token: 'foo',
    }

    token.set(tokenData)

    const result = token.get() as Token

    expect(result).not.toBeNull()

    expect(result.access_token).toBe(tokenData.access_token)

    await api.logout()

    expect(token.get()).toBeNull()
  })

  it('send reset password email to the user', async () => {
    const mock = new MockAdapter(client)

    mock.onPost('/auth/sendForgottenPassword').reply(HttpStatusCodes.OK)

    const requestData = {
      email: 'user@example.com',
    }
    const response = await api.recoverPassword(requestData)
    expect(response.status).toBe(HttpStatusCodes.OK)
  })

  it('should reset the user password', async () => {
    const mock = new MockAdapter(client)

    const mockData = {
      token: 'foo',
    }

    mock.onPost('/auth/resetPassword').reply(HttpStatusCodes.OK, mockData)

    expect(token.get()).toBeNull()

    await api.resetPassword({
      password: 'foo',
      deviceId: 'bar',
      token: 'foo',
    })

    const tokenData = token.get() as Token

    expect(tokenData.access_token).toEqual(mockData.token)
  })

  it('verify user email address', async () => {
    const mock = new MockAdapter(client)

    mock.onPost('/registration/verify').reply(HttpStatusCodes.OK)

    const requestData = {
      token: 'foobar',
    }
    const response = await api.verify(requestData)
    expect(response.status).toBe(HttpStatusCodes.OK)
  })
})
