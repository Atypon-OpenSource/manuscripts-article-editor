import { GenericStoreEnhancer } from 'redux'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (
      f: GenericStoreEnhancer
    ) => GenericStoreEnhancer
  }
}
