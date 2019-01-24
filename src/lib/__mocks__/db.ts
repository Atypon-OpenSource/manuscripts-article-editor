import PouchDBMemoryAdapter from 'pouchdb-adapter-memory'
import { Collections } from '../../collections'
import RxDB from '../rxdb'

RxDB.plugin(PouchDBMemoryAdapter)

export const databaseCreator = RxDB.create<Collections>({
  name: 'mockdb',
  adapter: 'memory',
  // queryChangeDetection: true,
})
