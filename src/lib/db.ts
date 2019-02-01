import { Collections } from '../collections'
import { adapter } from './adapter'
import RxDB from './rxdb'

const createDatabase = () =>
  RxDB.create<Collections>({
    name: 'manuscriptsdb',
    adapter,
    // queryChangeDetection: true,
  })

export let databaseCreator = createDatabase()

export const removeDatabase = async () => {
  const db = await databaseCreator

  await db.destroy()
  await db.remove()
}

export const recreateDatabase = async () => {
  await removeDatabase()

  databaseCreator = createDatabase()

  return databaseCreator
}
