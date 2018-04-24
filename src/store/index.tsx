import * as React from 'react'
import ComponentsProvider from './ComponentsProvider'
import UserProvider from './UserProvider'

interface StoreProvidersProps {
  children?: JSX.Element
}

export const StoreProviders = (props: StoreProvidersProps) => (
  <ComponentsProvider>
    <UserProvider>{props.children}</UserProvider>
  </ComponentsProvider>
)
