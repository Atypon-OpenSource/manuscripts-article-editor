import * as React from 'react'
import { RxDocument } from 'rxdb'
import { Person } from './person'

export interface ManuscriptInterface {
  _id: string
  title: string
  createdAt: string
  updatedAt: string
  authors: Person[] | undefined
}

export type AddManuscript = (data: Partial<ManuscriptInterface>) => void

export type UpdateManuscript = (
  doc: RxDocument<ManuscriptInterface>,
  data: Partial<ManuscriptInterface>
) => void

export type RemoveManuscript = (
  doc: RxDocument<ManuscriptInterface>
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface ManuscriptActions {
  addManuscript: AddManuscript
  updateManuscript: UpdateManuscript
  removeManuscript: RemoveManuscript
}
