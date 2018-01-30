jest.mock('./token')

import MockAdapter from 'axios-mock-adapter'
import * as api from './api'
import client from './client'
import token from './token'

describe('api', () => {
  afterEach(() => {
    token.remove()
  })

  it('returns data from authenticate', async () => {
    const mock = new MockAdapter(client)

    const mockData = { name: 'foo' }
    mock.onGet('/authentication').reply(200, mockData)

    const data = await api.authenticate()
    expect(data).toEqual(mockData)
  })

  it('stores the token after signup', async () => {
    const mock = new MockAdapter(client)

    const mockData = { token: 'foo' }
    mock.onPost('/authentication/signup').reply(200, mockData)

    expect(token.get()).toBeNull()

    await api.signup({
      name: 'foo',
      surname: 'foo',
      email: 'test@example.com',
      password: 'foo',
    })

    expect(token.get()).toEqual(mockData.token)
  })

  it('stores the token after login', async () => {
    const mock = new MockAdapter(client)

    const mockData = { token: 'foo' }
    mock.onPost('/authentication').reply(200, mockData)

    expect(token.get()).toBeNull()

    await api.login({
      email: 'test@example.com',
      password: 'foo',
    })

    expect(token.get()).toEqual(mockData.token)
  })

  it('removes the token after logout', async () => {
    const mock = new MockAdapter(client)

    mock.onDelete('/authentication').reply(204)

    token.set('foo')
    expect(token.get()).toBe('foo')

    await api.logout()

    expect(token.get()).toBeNull()
  })
})
