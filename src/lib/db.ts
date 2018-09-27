import PouchDBIDBAdapter from 'pouchdb-adapter-idb'
import RxDB from './rxdb'

RxDB.plugin(PouchDBIDBAdapter)

export const databaseCreator = RxDB.create({
  name: 'manuscriptsdb',
  adapter: 'idb',
})
