import { ReactNode } from 'react'

export interface User {
  name: string
  email: string
  password: string
  surname: string
}

export interface Authentication {
  user: User
  loading: boolean
  loaded: boolean
  error?: string
}

export interface AuthenticationState {
  authentication: Authentication
}

export interface AuthenticationActions {
  authenticate: () => void
}

export interface AuthenticationProps
  extends AuthenticationState,
    AuthenticationActions {}

export interface State {
  authentication: Authentication
}

export interface IconProps {
  size?: number
  color?: string
}

export interface ChildrenProps {
  children?: ReactNode
}
