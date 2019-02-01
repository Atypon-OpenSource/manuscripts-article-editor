import memdown from 'memdown'
import PouchDBLevelAdapter from 'pouchdb-adapter-leveldb'
import RxDB from '../rxdb'

RxDB.plugin(PouchDBLevelAdapter)

export const adapter = memdown
