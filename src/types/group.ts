import React from 'react'
import { RxDocument } from 'rxdb'
import { Group } from './components'

export type GroupDocument = RxDocument<Group>

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
