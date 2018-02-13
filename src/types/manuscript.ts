import { RxDocument } from 'rxdb'
import { Person } from './person'

export interface ManuscriptInterface {
  _id: string
  title: string
  createdAt: string
  updatedAt: string
  authors: Person[] | undefined
}

export type AddManuscript = (
  data: Partial<ManuscriptInterface>
) => Promise<RxDocument<ManuscriptInterface>>

export type UpdateManuscript = (
  doc: RxDocument<ManuscriptInterface>,
  data: Partial<ManuscriptInterface>
) => Promise<Partial<ManuscriptInterface>>

export type RemoveManuscript = (
  doc: RxDocument<ManuscriptInterface>
) => Promise<boolean>

export interface ManuscriptActions {
  addManuscript: AddManuscript
  updateManuscript: UpdateManuscript
  removeManuscript: RemoveManuscript
}
