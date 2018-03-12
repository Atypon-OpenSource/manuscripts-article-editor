import * as React from 'react'
import { RxDocument } from 'rxdb'
import { Group } from './components'

export type AddGroup = (data: Partial<Group>) => void

export type UpdateGroup = (
  doc: RxDocument<Group>,
  data: Partial<Group>
) => Promise<RxDocument<Group>>

export type RemoveGroup = (
  doc: RxDocument<Group>
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface GroupActions {
  addGroup: AddGroup
  updateGroup: UpdateGroup
  removeGroup: RemoveGroup
}
