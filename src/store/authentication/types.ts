import { Action } from 'redux'
import { ConnectedReduxProps } from '../types'

export interface UserInterface {
  name: string
  email: string
  password?: string
  surname: string
  phone?: string
}

export interface AuthenticationState {
  loading: boolean
  loaded: boolean
  user: UserInterface | undefined
  error: string | undefined
}

export interface AuthenticateRequestAction extends Action {
  type: string
}

export interface AuthenticateSuccessAction extends Action {
  type: string
  payload: UserInterface | undefined
}

export interface AuthenticateFailureAction extends Action {
  type: string
  payload: string
}

export type AuthenticationActions =
  | AuthenticateRequestAction
  | AuthenticateSuccessAction
  | AuthenticateFailureAction

export type AuthenticationDispatchProps = ConnectedReduxProps<
  AuthenticationState
>

export interface AuthenticationStateProps {
  authentication: AuthenticationState
}
