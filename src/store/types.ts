import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AuthenticationState } from './authentication/types'

export interface ApplicationState {
  authentication: AuthenticationState
}

export interface ConnectedReduxProps<S> {
  dispatch: Dispatch<S>
}

export type ThunkedAction = ThunkAction<Promise<Action>, ApplicationState, void>

export type ThunkActionCreator = ActionCreator<ThunkedAction>
