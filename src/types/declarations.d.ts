import { GenericStoreEnhancer } from 'redux'
import RxDB from 'rxdb/plugins/core'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (
      f: GenericStoreEnhancer
    ) => GenericStoreEnhancer
    db: RxDB.RxDatabase
    RxDB: RxDB
  }
}
