import * as React from 'react'
import { RxDocument } from 'rxdb'
import { Section } from './components'

export type AddSection = (data: Partial<Section>) => void

export type UpdateSection = (
  doc: RxDocument<Section>,
  data: Partial<Section>
) => void

export type RemoveSection = (
  doc: RxDocument<Section>
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface SectionActions {
  addSection: AddSection
  updateSection: UpdateSection
  removeSection: RemoveSection
}
