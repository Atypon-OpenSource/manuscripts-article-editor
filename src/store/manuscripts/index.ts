import { AxiosError } from 'axios'
import { Action, ActionCreator, Dispatch, Reducer } from 'redux'
import * as api from '../../lib/api'
import {
  ManuscriptInterface,
  PartialManuscriptInterface,
} from '../../types/manuscript'
import { ApplicationState, ThunkActionCreator } from '../types'
import {
  AddManuscriptSuccessAction,
  LoadManuscriptsFailureAction,
  LoadManuscriptsRequestAction,
  LoadManuscriptsSuccessAction,
  ManuscriptMap,
  ManuscriptsActions,
  ManuscriptsState,
  RemoveManuscriptSuccessAction,
  UpdateManuscriptSuccessAction,
} from './types'

/* constants */

export const LOAD_MANUSCRIPTS_REQUEST = 'LOAD_MANUSCRIPTS_REQUEST'
export const LOAD_MANUSCRIPTS_SUCCESS = 'LOAD_MANUSCRIPTS_SUCCESS'
export const LOAD_MANUSCRIPTS_FAILURE = 'LOAD_MANUSCRIPTS_FAILURE'
export const ADD_MANUSCRIPT_SUCCESS = 'ADD_MANUSCRIPT_SUCCESS'
export const UPDATE_MANUSCRIPT_SUCCESS = 'UPDATE_MANUSCRIPT_SUCCESS'
export const REMOVE_MANUSCRIPT_SUCCESS = 'REMOVE_MANUSCRIPT_SUCCESS'

/* actions */

export const loadManuscriptsRequest: ActionCreator<
  LoadManuscriptsRequestAction
> = () => ({
  type: LOAD_MANUSCRIPTS_REQUEST,
})

export const loadManuscriptsSuccess: ActionCreator<
  LoadManuscriptsSuccessAction
> = (data: ManuscriptInterface[]) => ({
  type: LOAD_MANUSCRIPTS_SUCCESS,
  payload: data,
})

export const loadManuscriptsFailure: ActionCreator<
  LoadManuscriptsFailureAction
> = (error: Error) => ({
  type: LOAD_MANUSCRIPTS_FAILURE,
  payload: error.message,
})

export const addManuscriptSuccess: ActionCreator<AddManuscriptSuccessAction> = (
  data: ManuscriptInterface
) => ({
  type: ADD_MANUSCRIPT_SUCCESS,
  payload: data,
})

export const updateManuscriptSuccess: ActionCreator<
  UpdateManuscriptSuccessAction
> = (data: PartialManuscriptInterface) => ({
  type: UPDATE_MANUSCRIPT_SUCCESS,
  payload: data,
})

export const removeManuscriptSuccess: ActionCreator<
  RemoveManuscriptSuccessAction
> = (id: string) => ({
  type: REMOVE_MANUSCRIPT_SUCCESS,
  payload: id,
})

export const loadManuscripts: ThunkActionCreator = () => (
  dispatch: Dispatch<ApplicationState>
): Promise<Action> => {
  dispatch(loadManuscriptsRequest())

  return api.list('manuscripts').then(
    data => {
      return dispatch(loadManuscriptsSuccess(data))
    },
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        // 401 response
        return dispatch(loadManuscriptsSuccess(null))
      }

      // any other error
      return dispatch(loadManuscriptsFailure(new Error('There was an error')))
    }
  )
}

export const addManuscript: ThunkActionCreator = (
  input: PartialManuscriptInterface
) => (dispatch: Dispatch<ApplicationState>): Promise<Action> => {
  return api.create('manuscripts', input).then((data: ManuscriptInterface) => {
    return dispatch(addManuscriptSuccess(data))
  })
}

export const updateManuscript: ThunkActionCreator = (
  id: string,
  input: PartialManuscriptInterface
) => (dispatch: Dispatch<ApplicationState>): Promise<Action> => {
  return api
    .update('manuscripts', id, input)
    .then((data: ManuscriptInterface) => {
      return dispatch(updateManuscriptSuccess(data))
    })
}

export const removeManuscript: ThunkActionCreator = (id: string) => (
  dispatch: Dispatch<ApplicationState>
): Promise<Action> => {
  return api.remove('manuscripts', id).then(() => {
    return dispatch(removeManuscriptSuccess(id))
  })
}

/* reducers */

const removeId = (input: ManuscriptMap, id: string): ManuscriptMap => {
  const output = { ...input }
  delete output[id]
  return output
}

const initialState: ManuscriptsState = {
  loading: false,
  loaded: false,
  items: {},
  error: undefined,
}

export const reducer: Reducer<ManuscriptsState> = (
  state = initialState,
  action: ManuscriptsActions
) => {
  switch (action.type) {
    case LOAD_MANUSCRIPTS_REQUEST:
      return {
        loading: true,
        loaded: false,
        items: {},
        error: undefined,
      }

    case LOAD_MANUSCRIPTS_SUCCESS:
      return {
        loading: false,
        loaded: true,
        items: (action as LoadManuscriptsSuccessAction).payload.reduce(
          (output: ManuscriptMap, item: ManuscriptInterface) => {
            output[item.id] = item
            return output
          },
          {}
        ),
        error: undefined,
      }

    case LOAD_MANUSCRIPTS_FAILURE:
      return {
        loading: false,
        loaded: false,
        items: state.items,
        error: (action as LoadManuscriptsFailureAction).payload,
      }

    case ADD_MANUSCRIPT_SUCCESS:
      const createdManuscript = (action as AddManuscriptSuccessAction).payload

      return {
        ...state,
        items: { ...state.items, [createdManuscript.id]: createdManuscript },
        error: undefined,
      }

    case UPDATE_MANUSCRIPT_SUCCESS:
      const updatedManuscript = (action as UpdateManuscriptSuccessAction)
        .payload
      // TODO: assert that updatedManuscript has a string id property

      return {
        ...state,
        items: {
          ...state.items,
          [updatedManuscript.id as string]: updatedManuscript,
        },
        error: undefined,
      }

    case REMOVE_MANUSCRIPT_SUCCESS:
      const removedId = (action as RemoveManuscriptSuccessAction).payload

      return {
        ...state,
        items: removeId(state.items, removedId),
        error: undefined,
      }

    default:
      return state
  }
}
