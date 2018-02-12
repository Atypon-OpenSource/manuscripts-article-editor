import { Action } from 'redux'
import {
  ManuscriptInterface,
  PartialManuscriptInterface,
} from '../../types/manuscript'
import { ConnectedReduxProps, ThunkActionCreator } from '../types'

interface StringMap<T> {
  [x: string]: T
}

export type ManuscriptMap = StringMap<ManuscriptInterface>

export interface ManuscriptsState {
  loading: boolean
  loaded: boolean
  items: ManuscriptMap
  error: string | undefined
}

export interface LoadManuscriptsRequestAction extends Action {
  type: string
}

export interface LoadManuscriptsSuccessAction extends Action {
  type: string
  payload: ManuscriptInterface[]
}

export interface LoadManuscriptsFailureAction extends Action {
  type: string
  payload: string
}

export interface AddManuscriptSuccessAction extends Action {
  type: string
  payload: ManuscriptInterface
}

export interface UpdateManuscriptSuccessAction extends Action {
  type: string
  payload: PartialManuscriptInterface
}

export interface RemoveManuscriptSuccessAction extends Action {
  type: string
  payload: string
}

export type ManuscriptsActions =
  | LoadManuscriptsRequestAction
  | LoadManuscriptsSuccessAction
  | LoadManuscriptsFailureAction
  | AddManuscriptSuccessAction
  | UpdateManuscriptSuccessAction
  | RemoveManuscriptSuccessAction

export interface ManuscriptsActionCreators {
  addManuscript: ThunkActionCreator
  updateManuscript: ThunkActionCreator
  removeManuscript: ThunkActionCreator
}

export type ManuscriptsDispatchProps = ConnectedReduxProps<ManuscriptsState> &
  ManuscriptsActionCreators

export interface ManuscriptsStateProps {
  manuscripts: ManuscriptsState
}
