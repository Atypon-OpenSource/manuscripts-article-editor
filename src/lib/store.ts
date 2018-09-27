import { RxDocument } from 'rxdb'
import { Component } from '../types/components'
import sessionID from './sessionID'
import timestamp from './timestamp'

export const prepareUpdate = <T extends Component>(
  data: Partial<T>
): Partial<T> => {
  // https://github.com/Microsoft/TypeScript/pull/13288
  // tslint:disable-next-line:no-any
  const { id, _rev, ...rest } = data as any

  return {
    ...rest,
    updatedAt: timestamp(),
    sessionID,
  }
}

export const atomicUpdate = async <T extends Component>(
  prev: RxDocument<T>,
  data: Partial<T>
): Promise<RxDocument<T>> => {
  const update = prepareUpdate(data)

  // tslint:disable-next-line:no-any
  return prev.atomicUpdate((doc: RxDocument<T> & { [key: string]: any }) => {
    Object.entries(update).forEach(([key, value]) => {
      doc[key] = value
    })

    return doc
  })
}
