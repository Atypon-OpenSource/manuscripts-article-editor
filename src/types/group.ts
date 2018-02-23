import * as React from 'react'
import { RxDocument } from 'rxdb'
import { GroupInterface } from './group'

export interface GroupInterface {
  _id: string
  name: string
  description: string
}

export type AddGroup = (data: Partial<GroupInterface>) => void

export type UpdateGroup = (
  doc: RxDocument<GroupInterface>,
  data: Partial<GroupInterface>
) => Promise<RxDocument<GroupInterface>>

export type RemoveGroup = (
  doc: RxDocument<GroupInterface>
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface GroupActions {
  addGroup: AddGroup
  updateGroup: UpdateGroup
  removeGroup: RemoveGroup
}
