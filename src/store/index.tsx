import React from 'react'
import ComponentsProvider from './ComponentsProvider'
import IntlProvider from './IntlProvider'
import KeywordsProvider from './KeywordsProvider'
import SharedDataProvider from './SharedDataProvider'
import UserProvider from './UserProvider'

interface Props {
  children?: JSX.Element
}

export const StoreProviders: React.SFC<Props> = props => (
  <SharedDataProvider>
    <ComponentsProvider>
      <UserProvider>
        <KeywordsProvider>
          <IntlProvider>{props.children}</IntlProvider>
        </KeywordsProvider>
      </UserProvider>
    </ComponentsProvider>
  </SharedDataProvider>
)
