import * as React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { reducer as authenticationReducer } from './authentication'

const store = createStore(
  combineReducers({
    authentication: authenticationReducer,
  }),
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
    applyMiddleware(thunk)
  )
)

export const StoreProvider: React.SFC = props => (
  <Provider store={store}>{props.children}</Provider>
)
