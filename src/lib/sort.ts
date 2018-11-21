import { Model } from '@manuscripts/manuscripts-json-schema'
import { RxDocument } from 'rxdb'

export const newestFirst = (a: RxDocument<Model>, b: RxDocument<Model>) =>
  Number(b.createdAt) - Number(a.createdAt)

export const oldestFirst = (a: RxDocument<Model>, b: RxDocument<Model>) =>
  Number(a.createdAt) - Number(b.createdAt)
