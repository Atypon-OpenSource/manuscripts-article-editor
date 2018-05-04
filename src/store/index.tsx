import React from 'react'
import ComponentsProvider from './ComponentsProvider'
import IntlProvider from './IntlProvider'
import SharedDataProvider from './SharedDataProvider'
import UserProvider from './UserProvider'

interface Props {
  children?: JSX.Element
}

export const StoreProviders: React.SFC<Props> = props => (
  <SharedDataProvider>
    <ComponentsProvider>
      <UserProvider>
        <IntlProvider>{props.children}</IntlProvider>
      </UserProvider>
    </ComponentsProvider>
  </SharedDataProvider>
)
