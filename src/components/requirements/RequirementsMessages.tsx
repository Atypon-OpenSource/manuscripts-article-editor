/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import React from 'react'
import { FormattedMessage } from 'react-intl'

export const RequiredSection: React.FunctionComponent<{
  category: string
}> = ({ category }) => (
  <FormattedMessage
    id={'required-section'}
    defaultMessage={`There must be a {category} section`}
    values={{ category }}
  />
)
export const SectionBodyHasContent = () => (
  <FormattedMessage
    id={'section-body-has-content'}
    defaultMessage={`The section body must contain content`}
  />
)
export const BibliographyDoiFormat = () => (
  <FormattedMessage
    id={'bibliography-doi-format'}
    defaultMessage={`The bibliography DOI format`}
  />
)
export const BibliographyDoiExist = () => (
  <FormattedMessage
    id={'bibliography-doi-exist'}
    defaultMessage={`The bibliography DOI does not exist`}
  />
)
export const SectionCategoryUniqueness = () => (
  <FormattedMessage
    id={'section-category-uniqueness'}
    defaultMessage={`The section should be unique`}
  />
)
export const SectionTitleMatch: React.FunctionComponent<{
  title: string | undefined
}> = ({ title }) => (
  <FormattedMessage
    id={'section-title-match'}
    defaultMessage={`The section title must match {title}`}
    values={{ title }}
  />
)
export const SectionTitleContainsContent = () => (
  <FormattedMessage
    id={'section-title-contains-content'}
    defaultMessage={`The section title must contain content`}
  />
)
export const SectionMinimumWords: React.FunctionComponent<{
  wordsNumber: number
}> = ({ wordsNumber }) => (
  <FormattedMessage
    id={'section-minimum-words'}
    defaultMessage={`The section must have more than {wordsNumber} words`}
    values={{ wordsNumber }}
  />
)
export const SectionMinimumCharacters: React.FunctionComponent<{
  charNumber: number
}> = ({ charNumber }) => (
  <FormattedMessage
    id={'section-minimum-characters'}
    defaultMessage={`The section must have more than {charNumber} characters`}
    values={{ charNumber }}
  />
)
export const SectionMaximumCharacters: React.FunctionComponent<{
  charNumber: number
}> = ({ charNumber }) => (
  <FormattedMessage
    id={'section-maximum-characters'}
    defaultMessage={`The section must have less than {charNumber} characters`}
    values={{ charNumber }}
  />
)
export const SectionMaximumWords: React.FunctionComponent<{
  wordsNumber: number
}> = ({ wordsNumber }) => (
  <FormattedMessage
    id={'section-maximum-words'}
    defaultMessage={`The section must have less than {wordsNumber} words`}
    values={{ wordsNumber }}
  />
)
export const SectionOrder: React.FunctionComponent<{
  sectionOrder: string[]
}> = ({ sectionOrder }) => (
  <FormattedMessage
    id={'section-order'}
    defaultMessage={`The sections order must be {sectionOrder}`}
    values={{ sectionOrder }}
  />
)
export const FigureFormatValidation: React.FunctionComponent<{
  format: string
}> = ({ format }) => (
  <FormattedMessage
    id={'figure-format-validation'}
    defaultMessage={`The figure format should be {format}`}
    values={{ format }}
  />
)
export const FigureContainsImage: React.FunctionComponent = () => (
  <FormattedMessage
    id={'figure-contains-image'}
    defaultMessage={`The figure panel must contain content`}
  />
)
export const ManuscriptMaximumCharacters: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-maximum-characters'}
    defaultMessage={`The manuscript must have less than {value} characters`}
    values={{ value }}
  />
)
export const ManuscriptMinimumCharacters: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-minimum-characters'}
    defaultMessage={`The manuscript must have more than {value} characters`}
    values={{ value }}
  />
)
export const ManuscriptMaximumWords: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-maximum-words'}
    defaultMessage={`The manuscript must have less than {value} words`}
    values={{ value }}
  />
)
export const ManuscriptMinimumWords: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-minimum-words'}
    defaultMessage={`The manuscript must have more than {value} words`}
    values={{ value }}
  />
)
export const ManuscriptTitleMaximumWords: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-title-maximum-words'}
    defaultMessage={`The manuscript title must have less than {value} words`}
    values={{ value }}
  />
)
export const ManuscriptTitleMinimumWords: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-title-minimum-words'}
    defaultMessage={`The manuscript title must have more than {value} words`}
    values={{ value }}
  />
)
export const ManuscriptTitleMaximumCharacters: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-title-maximum-characters'}
    defaultMessage={`The manuscript title must have less than {value} characters`}
    values={{ value }}
  />
)
export const ManuscriptTitleMinimumCharacters: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-title-minimum-characters'}
    defaultMessage={`The manuscript title must have more than {value} characters`}
    values={{ value }}
  />
)
export const ManuscriptMaximumReferences: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-maximum-references'}
    defaultMessage={`The manuscript references must have less than {value}`}
    values={{ value }}
  />
)
export const ManuscriptMaximumFigures: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-maximum-figures'}
    defaultMessage={`The manuscript figures must have less than {value}`}
    values={{ value }}
  />
)
export const ManuscriptMaximumTables: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-maximum-tables'}
    defaultMessage={`The manuscript tables must have less than {value}`}
    values={{ value }}
  />
)
export const ManuscriptMaximumCombinedFigureTables: React.FunctionComponent<{
  value: number
}> = ({ value }) => (
  <FormattedMessage
    id={'manuscript-maximum-combined-figure-tables'}
    defaultMessage={`The manuscript figures and tables must have less than {value}`}
    values={{ value }}
  />
)
export const DefaultMessage: React.FunctionComponent<{
  passed: boolean
}> = ({ passed }) =>
  passed ? (
    <FormattedMessage
      id={'Passed-Default-message'}
      defaultMessage={`Requirement get passed`}
      values={{ passed }}
    />
  ) : (
    <FormattedMessage
      id={'Default-message'}
      defaultMessage={`Requirement did not pass`}
      values={{ passed }}
    />
  )
