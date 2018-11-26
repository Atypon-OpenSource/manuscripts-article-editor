import React from 'react'
import IntlProvider from './IntlProvider'
import KeywordsProvider from './KeywordsProvider'
import ModelsProvider from './ModelsProvider'
import UserProvider from './UserProvider'

interface Props {
  children?: JSX.Element
}

export const StoreProviders: React.FunctionComponent<Props> = props => (
  <ModelsProvider>
    <UserProvider>
      <KeywordsProvider>
        <IntlProvider>{props.children}</IntlProvider>
      </KeywordsProvider>
    </UserProvider>
  </ModelsProvider>
)
