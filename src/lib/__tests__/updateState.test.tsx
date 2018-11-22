jest.mock('../db')
jest.mock('../fetchUser')

import { mount, shallow } from 'enzyme'

import PouchDBMemoryAdapter from 'pouchdb-adapter-memory'
import React from 'react'
import LoginPageContainer from '../../components/account/LoginPageContainer'
import RxDB from '../rxdb'
import token from '../token'

RxDB.plugin(PouchDBMemoryAdapter)

describe('Update state', () => {
  test('update googleLoginError state', async () => {
    const wrapper = mount(shallow(<LoginPageContainer />).get(0))

    expect(wrapper.state('googleLoginError')).toEqual(null)

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ error: 'Error' })
    expect(wrapper.state('googleLoginError')).toEqual('Error')
    expect(window.location.hash).toEqual('')
  })

  test('update infoLoginMessage state', async () => {
    const wrapper = mount(shallow(<LoginPageContainer />).get(0))

    expect(wrapper.state('infoLoginMessage')).toEqual(null)

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ action: 'logout' })
    expect(wrapper.state('infoLoginMessage')).toEqual(
      'You have been logged out.'
    )
    expect(window.location.hash).toEqual('')
  })

  test('set token', async () => {
    token.remove()
    expect(token.get()).toBe(null)

    const wrapper = mount(shallow(<LoginPageContainer />).get(0))

    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any

    await instance.updateState({ access_token: 'xyz' })
    expect(token.get()).toEqual({
      access_token: 'xyz',
    })
    expect(window.location.hash).toEqual('')
  })
})
