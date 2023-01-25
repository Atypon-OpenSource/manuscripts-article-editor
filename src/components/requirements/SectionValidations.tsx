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
import sectionCategories from '@manuscripts/data/dist/shared/section-categories.json'
import {
  CountValidationResult,
  Model,
  SectionBodyValidationResult,
  SectionCategory,
  SectionCategoryValidationResult,
  SectionTitleValidationResult,
} from '@manuscripts/json-schema'
import { AnyValidationResult } from '@manuscripts/requirements'
import { Build, ContainedModel } from '@manuscripts/transform'
import React from 'react'
import styled from 'styled-components'

import { RequirementContainer } from './RequirementContainer'
import { RequirementsData } from './RequirementsData'

export const SectionValidations: React.FC<{
  sortedData: AnyValidationResult[]
  modelMap: Map<string, Model>
  manuscriptID: string
  bulkUpdate: (items: Array<ContainedModel>) => Promise<void>
}> = ({ sortedData, modelMap, manuscriptID, bulkUpdate }) => {
  const isSectionValidation = (
    node: AnyValidationResult
  ): node is
    | Build<SectionTitleValidationResult>
    | Build<SectionBodyValidationResult>
    | Build<SectionCategoryValidationResult>
    | Build<CountValidationResult> => {
    if (
      node.type &&
      node.type.startsWith('section-') &&
      !node.type.startsWith('section-order')
    ) {
      return true
    }
    return false
  }

  let sectionValidation = sortedData.filter(
    (node: AnyValidationResult) =>
      isSectionValidation(node) && node.message !== undefined
  )

  const sectionsData = []
  while (sectionValidation.length > 0) {
    const category =
      isSectionValidation(sectionValidation[0]) &&
      sectionValidation[0].data.sectionCategory
    const sectionValidationId = sectionValidation[0]._id
    const sections = sectionValidation.filter(
      (node: AnyValidationResult) =>
        isSectionValidation(node) && node.data.sectionCategory === category
    )
    sectionValidation = sectionValidation.filter(
      (x) => sections.indexOf(x) === -1
    )
    const categoryData = sectionCategories.map((section: SectionCategory) => {
      if (section._id === category) {
        return section.name
      }
    })
    sectionsData.push(
      <>
        <RequirementContainer
          result={sections}
          key={sectionValidationId}
          title={categoryData}
        >
          <Requirement>
            {sections.map(
              (section: AnyValidationResult) =>
                section.message && (
                  <RequirementsData
                    node={section}
                    key={section._id}
                    modelMap={modelMap}
                    manuscriptID={manuscriptID}
                    bulkUpdate={bulkUpdate}
                  />
                )
            )}
          </Requirement>
        </RequirementContainer>
      </>
    )
    if (sectionValidation.length <= 0) {
      return <>{sectionsData}</>
    }
  }
  return null
}
const Requirement = styled.div`
  padding: 15px 0 0 0;
`
