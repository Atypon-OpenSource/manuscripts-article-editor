import PouchDBLevelAdapter from 'pouchdb-adapter-memory'
import RxDB from '../rxdb'

RxDB.plugin(PouchDBLevelAdapter)

export const adapter = 'memory'
