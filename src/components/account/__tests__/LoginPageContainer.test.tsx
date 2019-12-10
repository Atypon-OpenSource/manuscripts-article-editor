/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { mount, shallow, ShallowWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import tokenHandler from '../../../lib/token'
import { theme } from '../../../theme/theme'
import LoginPageContainer from '../LoginPageContainer'

jest.mock('../../../lib/adapter')
jest.mock('../../../lib/token')

const history = createMemoryHistory()

const props = {
  history,
  location: history.location,
  match: { params: {}, isExact: true, path: '/login', url: '/login' },
}

const messageText = (
  wrapper: ShallowWrapper<
    {},
    {
      message?: React.FunctionComponent
    },
    LoginPageContainer
  >
) => {
  const Message = wrapper.state('message')

  return Message
    ? mount(
        <ThemeProvider theme={theme}>
          <Message />
        </ThemeProvider>
      ).text()
    : null
}

describe('LoginPageContainer', () => {
  test('pass error in hash', async () => {
    const propsWithHash = {
      ...props,
      location: {
        ...props.location,
        hash: '#error=user-not-found',
      },
    }

    const wrapper = shallow<LoginPageContainer>(
      <LoginPageContainer {...propsWithHash} />
    )

    expect(window.location.hash).toEqual('')

    expect(messageText(wrapper)).toMatch(
      /^A user record matching your identity was unexpectedly not found/
    )
  })

  test('pass message in state', async () => {
    const propsWithState = {
      ...props,
      location: {
        ...props.location,
        state: {
          infoLoginMessage: 'You have been logged out.',
        },
      },
    }

    const wrapper = shallow<LoginPageContainer>(
      <LoginPageContainer {...propsWithState} />
    )

    expect(messageText(wrapper)).toBe('You have been logged out.')
  })

  test('pass token in hash', async () => {
    jest.spyOn(window.location, 'assign').mockImplementation(location => {
      expect(location).toEqual('/projects')
    })

    const propsWithHash = {
      ...props,
      location: {
        ...props.location,
        hash: '#access_token=xyz',
      },
    }

    shallow<LoginPageContainer>(<LoginPageContainer {...propsWithHash} />)

    expect(window.location.hash).toBe('')

    expect(window.location.assign).toHaveBeenCalledTimes(1)

    expect(tokenHandler.get()).toBe('xyz')

    jest.clearAllMocks()
  })
})
