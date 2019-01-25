import PouchDBIDBAdapter from 'pouchdb-adapter-idb'
import { Collections } from '../collections'
import RxDB from './rxdb'

RxDB.plugin(PouchDBIDBAdapter)

export const databaseCreator = RxDB.create<Collections>({
  name: 'manuscriptsdb',
  adapter: 'idb',
  // queryChangeDetection: true,
})
