jest.mock('../db')

import { shallow } from 'enzyme'
import { createMemoryHistory } from 'history'
import PouchDBMemoryAdapter from 'pouchdb-adapter-memory'
import React from 'react'
import LoginPageContainer from '../../components/account/LoginPageContainer'
import RxDB from '../rxdb'
import token from '../token'

RxDB.plugin(PouchDBMemoryAdapter)

const history = createMemoryHistory()

const props = {
  history,
  location: history.location,
  match: { params: {}, isExact: true, path: '/login', url: '/login' },
}

describe('Update state', () => {
  test('call identityProviderErrorMessage method', async () => {
    const wrapper = shallow(<LoginPageContainer {...props} />)

    expect(wrapper.state('message')).toBeNull()

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ error: 'Error' })
    expect(wrapper.state('message')).not.toBeNull()
    expect(window.location.hash).toEqual('')
  })

  test('call infoLoginMessage method', async () => {
    const wrapper = shallow(<LoginPageContainer {...props} />)

    expect(wrapper.state('message')).toBeNull()

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ action: 'logout' })
    expect(wrapper.state('message')).not.toBeNull()
    expect(window.location.hash).toEqual('')
  })

  test('set token', async () => {
    token.remove()
    expect(token.get()).toBe(null)

    const wrapper = shallow(<LoginPageContainer {...props} />)

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ access_token: 'xyz' })
    expect(token.get()).toEqual({
      access_token: 'xyz',
    })
    expect(window.location.hash).toEqual('')
  })
})
