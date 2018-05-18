import React from 'react'
import { RxDocument } from 'rxdb'
import { Manuscript } from './components'

export type ManuscriptDocument = RxDocument<Manuscript>

export type AddManuscript = () => Promise<void>

export type UpdateManuscript = (
  doc: ManuscriptDocument,
  data: Partial<Manuscript>
) => void

export type RemoveManuscript = (
  doc: ManuscriptDocument
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface ManuscriptActions {
  addManuscript: AddManuscript
  updateManuscript: UpdateManuscript
  removeManuscript: RemoveManuscript
}
