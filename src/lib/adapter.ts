import PouchDBIDBAdapter from 'pouchdb-adapter-idb'
import RxDB from './rxdb'

RxDB.plugin(PouchDBIDBAdapter)

export const adapter = 'idb'
