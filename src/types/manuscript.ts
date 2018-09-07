import React from 'react'
import { RxDocument } from 'rxdb'
import { AnyComponent, Manuscript } from './components'

export type ManuscriptDocument = RxDocument<Manuscript>

export type AddManuscript = () => Promise<void>

export type ImportManuscript = (components: AnyComponent[]) => Promise<void>
export type ExportManuscript = (format: string) => Promise<void>

export type UpdateManuscript = (
  manuscript: Manuscript,
  data: Partial<Manuscript>
) => void

export type RemoveManuscript = (
  manuscriptID: string
) => (event: React.SyntheticEvent<HTMLElement>) => Promise<void>

export interface ManuscriptActions {
  addManuscript: AddManuscript
  updateManuscript: UpdateManuscript
  removeManuscript: RemoveManuscript
}
