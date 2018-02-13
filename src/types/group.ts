import { RxDocument } from 'rxdb'

export interface GroupInterface {
  _id: string
  name: string
}

export type AddGroup = (
  data: Partial<GroupInterface>
) => Promise<RxDocument<GroupInterface>>

export type UpdateGroup = (
  doc: RxDocument<GroupInterface>,
  data: Partial<GroupInterface>
) => Promise<Partial<GroupInterface>>

export type RemoveGroup = (doc: RxDocument<GroupInterface>) => Promise<boolean>

export interface GroupActions {
  addGroup: AddGroup
  updateGroup: UpdateGroup
  removeGroup: RemoveGroup
}
