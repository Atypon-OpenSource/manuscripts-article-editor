import * as React from 'react'
import { RxDocument } from 'rxdb'

export interface SectionInterface {
  _id: string
  manuscript: string
  title: string
  createdAt?: string
  updatedAt?: string
  content: string
}

export type AddSection = (data: Partial<SectionInterface>) => void

export type UpdateSection = (
  doc: RxDocument<SectionInterface>,
  data: Partial<SectionInterface>
) => void

export type RemoveSection = (
  doc: RxDocument<SectionInterface>
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface SectionActions {
  addSection: AddSection
  updateSection: UpdateSection
  removeSection: RemoveSection
}
