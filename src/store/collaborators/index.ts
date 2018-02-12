import { AxiosError } from 'axios'
import { Action, ActionCreator, Dispatch, Reducer } from 'redux'
import * as api from '../../lib/api'
import { PartialPerson, Person } from '../../types/person'
import { ApplicationState, ThunkActionCreator } from '../types'
import {
  AddCollaboratorSuccessAction,
  CollaboratorsActions,
  CollaboratorsState,
  LoadCollaboratorsFailureAction,
  LoadCollaboratorsRequestAction,
  LoadCollaboratorsSuccessAction,
  PersonMap,
  RemoveCollaboratorSuccessAction,
  UpdateCollaboratorSuccessAction,
} from './types'

/* constants */

export const LOAD_COLLABORATORS_REQUEST = 'LOAD_COLLABORATORS_REQUEST'
export const LOAD_COLLABORATORS_SUCCESS = 'LOAD_COLLABORATORS_SUCCESS'
export const LOAD_COLLABORATORS_FAILURE = 'LOAD_COLLABORATORS_FAILURE'
export const ADD_COLLABORATOR_SUCCESS = 'ADD_COLLABORATOR_SUCCESS'
export const UPDATE_COLLABORATOR_SUCCESS = 'UPDATE_COLLABORATOR_SUCCESS'
export const REMOVE_COLLABORATOR_SUCCESS = 'REMOVE_COLLABORATOR_SUCCESS'

/* actions */

export const loadCollaboratorsRequest: ActionCreator<
  LoadCollaboratorsRequestAction
> = () => ({
  type: LOAD_COLLABORATORS_REQUEST,
})

export const loadCollaboratorsSuccess: ActionCreator<
  LoadCollaboratorsSuccessAction
> = (data: Person[]) => ({
  type: LOAD_COLLABORATORS_SUCCESS,
  payload: data,
})

export const loadCollaboratorsFailure: ActionCreator<
  LoadCollaboratorsFailureAction
> = (error: Error) => ({
  type: LOAD_COLLABORATORS_FAILURE,
  payload: error.message,
})

export const addCollaboratorSuccess: ActionCreator<
  AddCollaboratorSuccessAction
> = (data: Person) => ({
  type: ADD_COLLABORATOR_SUCCESS,
  payload: data,
})

export const updateCollaboratorSuccess: ActionCreator<
  UpdateCollaboratorSuccessAction
> = (data: PartialPerson) => ({
  type: UPDATE_COLLABORATOR_SUCCESS,
  payload: data,
})

export const removeCollaboratorSuccess: ActionCreator<
  RemoveCollaboratorSuccessAction
> = (id: string) => ({
  type: REMOVE_COLLABORATOR_SUCCESS,
  payload: id,
})

export const loadCollaborators: ThunkActionCreator = () => (
  dispatch: Dispatch<ApplicationState>
): Promise<Action> => {
  dispatch(loadCollaboratorsRequest())

  return api.list('collaborators').then(
    data => {
      return dispatch(loadCollaboratorsSuccess(data))
    },
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        // 401 response
        return dispatch(loadCollaboratorsSuccess(null))
      }

      // any other error
      return dispatch(loadCollaboratorsFailure(new Error('There was an error')))
    }
  )
}

export const addCollaborator: ThunkActionCreator = (input: PartialPerson) => (
  dispatch: Dispatch<ApplicationState>
): Promise<Action> => {
  return api.create('collaborators', input).then((data: Person) => {
    return dispatch(addCollaboratorSuccess(data))
  })
}

export const updateCollaborator: ThunkActionCreator = (
  id: string,
  input: PartialPerson
) => (dispatch: Dispatch<ApplicationState>): Promise<Action> => {
  return api.update('collaborators', id, input).then((data: Person) => {
    return dispatch(updateCollaboratorSuccess(data))
  })
}

export const removeCollaborator: ThunkActionCreator = (id: string) => (
  dispatch: Dispatch<ApplicationState>
): Promise<Action> => {
  return api.remove('collaborators', id).then(() => {
    return dispatch(removeCollaboratorSuccess(id))
  })
}

/* reducers */

const removeId = (input: PersonMap, id: string): PersonMap => {
  const output = { ...input }
  delete output[id]
  return output
}

const initialState: CollaboratorsState = {
  loading: false,
  loaded: false,
  items: {},
  error: undefined,
}

export const reducer: Reducer<CollaboratorsState> = (
  state = initialState,
  action: CollaboratorsActions
) => {
  switch (action.type) {
    case LOAD_COLLABORATORS_REQUEST:
      return {
        loading: true,
        loaded: false,
        items: {},
        error: undefined,
      }

    case LOAD_COLLABORATORS_SUCCESS:
      return {
        loading: false,
        loaded: true,
        items: (action as LoadCollaboratorsSuccessAction).payload.reduce(
          (output: PersonMap, item: Person) => {
            output[item.id] = item
            return output
          },
          {}
        ),
        error: undefined,
      }

    case LOAD_COLLABORATORS_FAILURE:
      return {
        loading: false,
        loaded: false,
        items: state.items,
        error: (action as LoadCollaboratorsFailureAction).payload,
      }

    case ADD_COLLABORATOR_SUCCESS:
      const createdPerson = (action as AddCollaboratorSuccessAction).payload

      return {
        ...state,
        items: { ...state.items, [createdPerson.id]: createdPerson },
        error: undefined,
      }

    case UPDATE_COLLABORATOR_SUCCESS:
      const updatedPerson = (action as UpdateCollaboratorSuccessAction).payload
      // TODO: assert that updatedPerson has a string id property

      return {
        ...state,
        items: { ...state.items, [updatedPerson.id as string]: updatedPerson },
        error: undefined,
      }

    case REMOVE_COLLABORATOR_SUCCESS:
      const removedId = (action as RemoveCollaboratorSuccessAction).payload

      return {
        ...state,
        items: removeId(state.items, removedId),
        error: undefined,
      }

    default:
      return state
  }
}
