import * as React from 'react'
import { RxDocument } from 'rxdb'
import { Section } from './components'

export type SectionDocument = RxDocument<Section>

export type AddSection = (data: Partial<Section>) => void

export type UpdateSection = (
  doc: SectionDocument,
  data: Partial<Section>
) => void

export type RemoveSection = (
  doc: SectionDocument
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface SectionActions {
  addSection: AddSection
  updateSection: UpdateSection
  removeSection: RemoveSection
}
