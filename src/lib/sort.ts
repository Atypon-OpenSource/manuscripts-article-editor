import { RxDocument } from 'rxdb'
import { Component } from '../types/components'

export const newestFirst = (
  a: RxDocument<Component>,
  b: RxDocument<Component>
) => b.createdAt! - a.createdAt!

export const oldestFirst = (
  a: RxDocument<Component>,
  b: RxDocument<Component>
) => a.createdAt! - b.createdAt!
