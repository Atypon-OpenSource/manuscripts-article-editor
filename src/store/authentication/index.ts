import { AxiosError } from 'axios'
import { Action, ActionCreator, Dispatch, Reducer } from 'redux'
import * as api from '../../lib/api'
import { ApplicationState, ThunkActionCreator } from '../types'
import {
  AuthenticateFailureAction,
  AuthenticateRequestAction,
  AuthenticateSuccessAction,
  AuthenticationActions,
  AuthenticationState,
  User,
} from './types'

/* constants */

export const AUTHENTICATE_REQUEST = 'AUTHENTICATE_REQUEST'
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS'
export const AUTHENTICATE_FAILURE = 'AUTHENTICATE_FAILURE'

/* action creators */

export const authenticateRequest: ActionCreator<
  AuthenticateRequestAction
> = () => ({
  type: AUTHENTICATE_REQUEST,
})

export const authenticateSuccess: ActionCreator<AuthenticateSuccessAction> = (
  data: User | undefined
) => ({
  type: AUTHENTICATE_SUCCESS,
  payload: data,
})

export const authenticateFailure: ActionCreator<AuthenticateFailureAction> = (
  error: Error
) => ({
  type: AUTHENTICATE_FAILURE,
  payload: error.message,
})

export const authenticate: ThunkActionCreator = () => (
  dispatch: Dispatch<ApplicationState>
): Promise<Action> => {
  dispatch(authenticateRequest())

  const storedUser = window.localStorage.getItem('user')

  if (storedUser) {
    dispatch(authenticateSuccess(storedUser))
  }

  return api.authenticate().then(
    (data: User | undefined) => {
      return dispatch(authenticateSuccess(data))
    },
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        // 401 response
        return dispatch(authenticateSuccess(undefined))
      }

      // any other error
      return dispatch(authenticateFailure(new Error('There was an error')))
    }
  )
}

/* reducers */

const initialState: AuthenticationState = {
  loading: false,
  loaded: false,
  user: undefined,
  error: undefined,
}

export const reducer: Reducer<AuthenticationState> = (
  state = initialState,
  action: AuthenticationActions
) => {
  switch (action.type) {
    case AUTHENTICATE_REQUEST:
      return {
        loading: true,
        loaded: false,
        user: undefined,
        error: undefined,
      }

    case AUTHENTICATE_SUCCESS:
      return {
        loading: false,
        loaded: true,
        user: (action as AuthenticateSuccessAction).payload,
        error: undefined,
      }

    case AUTHENTICATE_FAILURE:
      return {
        loading: false,
        loaded: state.loaded,
        user: state.user,
        error: (action as AuthenticateFailureAction).payload,
      }

    default:
      return state
  }
}
