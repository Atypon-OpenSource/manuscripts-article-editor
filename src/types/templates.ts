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
