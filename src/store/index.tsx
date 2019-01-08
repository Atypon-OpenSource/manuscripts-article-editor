import React from 'react'
import IntlProvider from './IntlProvider'
import ModelsProvider from './ModelsProvider'
import UserProvider from './UserProvider'

interface Props {
  children?: JSX.Element
}

export const StoreProviders: React.FunctionComponent<Props> = props => (
  <ModelsProvider>
    <UserProvider>
      <IntlProvider>{props.children}</IntlProvider>
    </UserProvider>
  </ModelsProvider>
)
