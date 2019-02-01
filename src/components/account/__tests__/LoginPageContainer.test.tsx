import { mount, shallow, ShallowWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { TokenActions } from '../../../data/TokenData'
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

const tokenActions: TokenActions = {
  update: tokenHandler.set,
  delete: tokenHandler.remove,
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
      <LoginPageContainer {...propsWithHash} tokenActions={tokenActions} />
    )

    expect(window.location.hash).toEqual('')

    expect(messageText(wrapper)).toMatch(
      /^A user record matching your identity at Google was unexpectedly not found/
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
      <LoginPageContainer {...propsWithState} tokenActions={tokenActions} />
    )

    expect(messageText(wrapper)).toBe('You have been logged out.')
  })

  test('pass token in hash', async () => {
    const propsWithHash = {
      ...props,
      location: {
        ...props.location,
        hash: '#access_token=xyz',
      },
    }

    shallow<LoginPageContainer>(
      <LoginPageContainer {...propsWithHash} tokenActions={tokenActions} />
    )

    expect(window.location.hash).toBe('')
    expect(window.location.href).toBe('https://localhost/')

    expect(tokenHandler.get()).toBe('xyz')
  })
})
