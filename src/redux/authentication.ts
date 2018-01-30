import { Dispatch } from 'react-redux'
import { PayloadAction } from '.'
import * as api from '../api'
import { User } from '../types'

/* constants */

export const AUTHENTICATE_REQUEST = 'AUTHENTICATE_REQUEST'
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS'
export const AUTHENTICATE_FAILURE = 'AUTHENTICATE_FAILURE'

/* actions */

export const authenticateRequest = () => ({
  type: AUTHENTICATE_REQUEST,
})

export const authenticateSuccess = (data: User | null) => ({
  type: AUTHENTICATE_SUCCESS,
  payload: data,
})

export const authenticateFailure = (error: Error) => ({
  type: AUTHENTICATE_FAILURE,
  payload: error.message,
})

export const authenticate = () => (dispatch: Dispatch<() => PayloadAction>) => {
  dispatch(authenticateRequest())

  return api.authenticate().then(
    data => {
      dispatch(authenticateSuccess(data))
    },
    error => {
      if (error.response && error.response.status === 401) {
        // 401 response
        dispatch(authenticateSuccess(null))
      } else {
        // any other error
        dispatch(authenticateFailure(new Error('There was an error')))
      }
    }
  )
}

/* reducers */

const initialState = {
  loading: false,
  loaded: false,
  user: null,
  error: null,
}

export const reducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case AUTHENTICATE_REQUEST:
      return {
        loading: true,
        loaded: false,
        user: null,
        error: null,
      }

    case AUTHENTICATE_SUCCESS:
      return {
        loading: false,
        loaded: true,
        user: action.payload,
        error: null,
      }

    case AUTHENTICATE_FAILURE:
      return {
        loading: false,
        loaded: false,
        user: state.user,
        error: action.payload,
      }

    default:
      return state
  }
}
