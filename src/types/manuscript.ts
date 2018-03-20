import * as React from 'react'
import RxDB from 'rxdb/plugins/core'
import { Manuscript } from './components'

export type ManuscriptDocument = RxDB.RxDocument<Manuscript>

export type AddManuscript = (data: Partial<Manuscript>) => void

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
