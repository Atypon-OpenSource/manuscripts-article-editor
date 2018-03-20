import * as React from 'react'
import RxDB from 'rxdb/plugins/core'
import { Section } from './components'

export type SectionDocument = RxDB.RxDocument<Section>

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
