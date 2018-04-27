import * as React from 'react'
import ComponentsProvider from './ComponentsProvider'
import IntlProvider from './IntlProvider'
import UserProvider from './UserProvider'

interface StoreProvidersProps {
  children?: JSX.Element
}

export const StoreProviders = (props: StoreProvidersProps) => (
  <ComponentsProvider>
    <UserProvider>
      <IntlProvider>{props.children}</IntlProvider>
    </UserProvider>
  </ComponentsProvider>
)
