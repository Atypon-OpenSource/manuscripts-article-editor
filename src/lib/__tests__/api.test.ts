jest.mock('../token')

import MockAdapter from 'axios-mock-adapter'
import * as httpStatusCodes from 'http-status-codes'
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

    mock.onGet('/user').reply(httpStatusCodes.OK, mockData)

    const result = await api.authenticate()

    expect(result).toEqual(mockData)
  })

  it('returns data from signup', async () => {
    const mock = new MockAdapter(client)

    mock.onPost('/registration/signup').reply(httpStatusCodes.OK)

    const result = await api.signup({
      name: 'foo',
      email: 'test@example.com',
      password: 'foo-min-length-8',
    })

    expect(result.status).toEqual(httpStatusCodes.OK)
  })

  it('stores the token after login', async () => {
    const mock = new MockAdapter(client)

    const mockData = {
      access_token: 'foo',
      refresh_token: 'bar',
      expires_in: 100,
      token_type: 'bearer',
    }

    mock.onPost('/token').reply(httpStatusCodes.OK, mockData)

    expect(token.get()).toBeNull()

    await api.login({
      email: 'test@example.com',
      password: 'foo',
    })

    const tokenData = token.get() as Token

    expect(tokenData.access_token).toEqual(mockData.access_token)
  })

  it('removes the token after logout', async () => {
    const mock = new MockAdapter(client)

    mock.onPost('/logout').reply(204)

    const tokenData = {
      access_token: 'foo',
      refresh_token: 'bar',
      expires_in: 100,
      token_type: 'bearer',
    }

    token.set(tokenData)

    const result = token.get() as Token

    expect(result).not.toBeNull()

    expect(result.access_token).toBe(tokenData.access_token)

    await api.logout()

    expect(token.get()).toBeNull()
  })
})
