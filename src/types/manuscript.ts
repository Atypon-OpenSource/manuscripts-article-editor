import * as React from 'react'
import { RxDocument } from 'rxdb'
import { Manuscript } from './components'

export type AddManuscript = (data: Partial<Manuscript>) => void

export type UpdateManuscript = (
  doc: RxDocument<Manuscript>,
  data: Partial<Manuscript>
) => void

export type RemoveManuscript = (
  doc: RxDocument<Manuscript>
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface ManuscriptActions {
  addManuscript: AddManuscript
  updateManuscript: UpdateManuscript
  removeManuscript: RemoveManuscript
}
