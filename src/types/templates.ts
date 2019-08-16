/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  Bundle,
  EmbeddedModel,
  Model,
  NumberingStyle,
} from '@manuscripts/manuscripts-json-schema'

type Bundled<T extends Model> = T & { bundled?: true }

type BundledModel = Bundled<Model>

export interface SectionCategory extends BundledModel {
  name: string
  desc: string
  priority: number
  titles: string[]
}

export interface Publisher extends BundledModel {
  name: string
  websiteURL?: string
  canArchivePreprint?: boolean
  canArchivePostprint?: boolean
  synonyms?: string[]
}

export interface TemplateData {
  template?: ManuscriptTemplate
  bundle?: Bundle
  title: string
  articleType?: string
  publisher?: Publisher
  category?: string
}

export interface ManuscriptTemplate extends BundledModel {
  parent?: string
  title: string
  desc?: string
  aim?: string
  category?: string
  bundle?: string
  publisher?: string
  requirementIDs?: string[]
  priority?: number
  requirements?: object
  styles?: object
  hidden?: number // true = 1
  LaTeXTemplateURL?: string
  manuscriptRunningTitleRequirement?: string
  maxCharCountRequirement?: string
  maxCombinedFigureTableCountRequirement?: string
  maxFigureFileSizeRequirement?: string
  maxWordCountRequirement?: string
  minCombinedFigureTableCountRequirement?: string
  minFigureScreenDPIRequirement?: string
  ISSNs?: string[]
  licenses?: string[]
  acceptableFigureFormats?: string[]
  acceptableManuscriptFormats?: string[]
  authorInstructionsURL?: string
  bodyLineSpacing?: number
  eISSNs?: string[]
  embeddedTableElementNumberingStyle?: NumberingStyle
  notes?: string
  sourceURL?: string
  tableElementFileLayout?: number
}

export interface ResearchField extends BundledModel {
  name: string
  priority: number
}

export interface SectionDescription extends EmbeddedModel {
  required?: boolean
  sectionCategory: string // SectionCategory id
  title?: string
  titles?: string[]
  placeholder?: string
  subsections?: Array<{ title: string; placeholder?: string }>
  maxWordCount?: number
  minWordCount?: number
  maxKeywordCount?: number
  minKeywordCount?: number
  objectType: 'MPSectionDescription'
}

export interface MandatorySubsectionsRequirement extends BundledModel {
  evaluatedObject: string
  embeddedSectionDescriptions: SectionDescription[]
  severity: number
}

interface MinimumManuscriptWordCountRequirement extends BundledModel {
  count: number
  severity: number
}

interface MaximumManuscriptWordCountRequirement extends BundledModel {
  count: number
  severity: number
}

export type RequirementType =
  | MandatorySubsectionsRequirement
  | MaximumManuscriptWordCountRequirement
  | MinimumManuscriptWordCountRequirement
  | MandatorySubsectionsRequirement

export type TemplatesDataType = ManuscriptTemplate | RequirementType
