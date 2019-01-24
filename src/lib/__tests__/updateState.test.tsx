jest.mock('../db')

import { shallow } from 'enzyme'
import { createMemoryHistory } from 'history'
import PouchDBMemoryAdapter from 'pouchdb-adapter-memory'
import React from 'react'
import LoginPageContainer from '../../components/account/LoginPageContainer'
import { TokenActions } from '../../data/TokenData'
import RxDB from '../rxdb'

RxDB.plugin(PouchDBMemoryAdapter)

const history = createMemoryHistory()

const props = {
  history,
  location: history.location,
  match: { params: {}, isExact: true, path: '/login', url: '/login' },
}

describe('Update state', () => {
  test('call identityProviderErrorMessage method', async () => {
    const tokenActions: TokenActions = {
      update: jest.fn(),
      delete: jest.fn(),
    }

    const wrapper = shallow(
      <LoginPageContainer {...props} tokenActions={tokenActions} />
    )

    expect(wrapper.state('message')).toBeNull()

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ error: 'Error' })
    expect(wrapper.state('message')).not.toBeNull()
    expect(window.location.hash).toEqual('')
  })

  test('call infoLoginMessage method', async () => {
    const tokenActions: TokenActions = {
      update: jest.fn(),
      delete: jest.fn(),
    }

    const wrapper = shallow(
      <LoginPageContainer {...props} tokenActions={tokenActions} />
    )

    expect(wrapper.state('message')).toBeNull()

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ action: 'logout' })
    expect(wrapper.state('message')).not.toBeNull()
    expect(window.location.hash).toEqual('')
  })

  test('set token', async () => {
    let token = ''

    const tokenActions: TokenActions = {
      update: (value: string) => {
        token = value
      },
      delete: () => {
        token = ''
      },
    }

    const wrapper = shallow(
      <LoginPageContainer {...props} tokenActions={tokenActions} />
    )

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ access_token: 'xyz' })

    expect(token).toEqual('xyz')

    expect(window.location.hash).toEqual('')
  })
})
