import { Action } from 'redux'
import { PartialPerson, Person } from '../../types/person'
import { ConnectedReduxProps, ThunkActionCreator } from '../types'

interface StringMap<T> {
  [x: string]: T
}

export type PersonMap = StringMap<Person>

export interface CollaboratorsState {
  loading: boolean
  loaded: boolean
  items: PersonMap
  error: string | undefined
}

export interface LoadCollaboratorsRequestAction extends Action {
  type: string
}

export interface LoadCollaboratorsSuccessAction extends Action {
  type: string
  payload: Person[]
}

export interface LoadCollaboratorsFailureAction extends Action {
  type: string
  payload: string
}

export interface AddCollaboratorSuccessAction extends Action {
  type: string
  payload: Person
}

export interface UpdateCollaboratorSuccessAction extends Action {
  type: string
  payload: PartialPerson
}

export interface RemoveCollaboratorSuccessAction extends Action {
  type: string
  payload: string
}

export type CollaboratorsActions =
  | LoadCollaboratorsRequestAction
  | LoadCollaboratorsSuccessAction
  | LoadCollaboratorsFailureAction
  | AddCollaboratorSuccessAction
  | UpdateCollaboratorSuccessAction
  | RemoveCollaboratorSuccessAction

export interface CollaboratorsActionCreators {
  addCollaborator: ThunkActionCreator
  updateCollaborator: ThunkActionCreator
  removeCollaborator: ThunkActionCreator
}

export type CollaboratorsDispatchProps = ConnectedReduxProps<
  CollaboratorsState
> &
  CollaboratorsActionCreators

export interface CollaboratorsStateProps {
  collaborators: CollaboratorsState
}

// export interface CollaboratorsActions {
//   addCollaborator:
//     | HandlerFunction
//     | ((input: PartialPerson) => ActionDispatcher)
//   updateCollaborator:
//     | HandlerFunction
//     | ((id: string, input: PartialPerson) => ActionDispatcher)
//   removeCollaborator: HandlerFunction | ((id: string) => ActionDispatcher)
// }
