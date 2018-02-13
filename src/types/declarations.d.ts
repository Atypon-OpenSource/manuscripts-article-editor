import { GenericStoreEnhancer } from 'redux'
import { RxDatabase } from 'rxdb'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (
      f: GenericStoreEnhancer
    ) => GenericStoreEnhancer
    db: RxDatabase
  }
}

// declare module 'pouchdb-adapter-idb'

declare module 'react-feather'
