import * as React from 'react'
import { Provider } from 'react-redux'
import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux'
import thunk from 'redux-thunk'
import { ChildrenProps } from '../types'
import { reducer as authenticationReducer } from './authentication'

// tslint:disable:no-any

const store = createStore(
  combineReducers({
    authentication: authenticationReducer,
  }),
  ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
    applyMiddleware(thunk)
  )
)

export const StoreProvider = (props: ChildrenProps) => (
  <Provider store={store}>{props.children}</Provider>
)

export interface PayloadAction extends Action {
  payload: any
}
