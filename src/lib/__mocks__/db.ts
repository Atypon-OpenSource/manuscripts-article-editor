import PouchDBMemoryAdapter from 'pouchdb-adapter-memory'
import RxDB from '../rxdb'

RxDB.plugin(PouchDBMemoryAdapter)

export const databaseCreator = RxDB.create({
  name: 'mockdb',
  adapter: 'memory',
})
