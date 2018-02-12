import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AuthenticationState } from './authentication/types'
import { CollaboratorsState } from './collaborators/types'
import { ManuscriptsState } from './manuscripts/types'

export interface ApplicationState {
  authentication: AuthenticationState
  collaborators: CollaboratorsState
  manuscripts: ManuscriptsState
}

export interface ConnectedReduxProps<S> {
  dispatch: Dispatch<S>
}

export type ThunkedAction = ThunkAction<Promise<Action>, ApplicationState, void>

export type ThunkActionCreator = ActionCreator<ThunkedAction>
