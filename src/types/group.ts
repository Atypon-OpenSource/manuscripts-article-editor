import * as React from 'react'
import RxDB from 'rxdb/plugins/core'
import { Group } from './components'

export type GroupDocument = RxDB.RxDocument<Group>

export type AddGroup = (data: Partial<Group>) => void

export type UpdateGroup = (
  doc: GroupDocument,
  data: Partial<Group>
) => Promise<GroupDocument>

export type RemoveGroup = (
  doc: GroupDocument
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface GroupActions {
  addGroup: AddGroup
  updateGroup: UpdateGroup
  removeGroup: RemoveGroup
}
