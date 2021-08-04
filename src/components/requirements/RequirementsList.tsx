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

import { ContainedModel } from '@manuscripts/manuscript-transform'
import { Model } from '@manuscripts/manuscripts-json-schema'
import { AnyValidationResult } from '@manuscripts/requirements'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { RequirementContainer } from './RequirementContainer'
import { RequirementsData } from './RequirementsData'
import { SectionValidations } from './SectionValidations'

export const RequirementsList: React.FC<{
  validationResult: AnyValidationResult[]
  modelMap: Map<string, Model>
  manuscriptID: string
  bulkUpdate: (items: Array<ContainedModel>) => Promise<void>
}> = ({ validationResult, modelMap, manuscriptID, bulkUpdate }) => {
  const sortedData = useMemo(
    () =>
      [...validationResult].sort((a, b) =>
        a.passed === b.passed ? 0 : a ? -1 : 1
      ),
    [validationResult]
  )
  const ignoredValidations = sortedData.filter(
    (node: AnyValidationResult) => node.ignored
  )
  const validationsList = sortedData.filter(
    (node: AnyValidationResult) => !node.ignored
  )
  const manuscriptValidation = validationsList.filter(
    (node: AnyValidationResult) =>
      node.type && node.type.startsWith('manuscript-')
  )
  const bibliographyValidation = validationsList.filter(
    (node: AnyValidationResult) =>
      node.type && node.type.startsWith('bibliography-')
  )
  const figureValidation = validationsList.filter(
    (node: AnyValidationResult) => node.type && node.type.startsWith('figure-')
  )
  const requiredSectionValidation = validationsList.filter(
    (node: AnyValidationResult) => node.type === 'required-section'
  )
  const sectionOrderValidation = validationsList.filter(
    (node: AnyValidationResult) => node.type === 'section-order'
  )
  const sectionValidation = validationsList.filter(
    (node: AnyValidationResult) => node.type && node.type.startsWith('section-')
  )

  return (
    <RequirementList>
      {manuscriptValidation.length !== 0 && (
        <RequirementContainer
          result={manuscriptValidation}
          title={'Manuscript'}
        >
          <Requirement>
            {manuscriptValidation.map(
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
      )}
      <SectionValidations
        sortedData={sectionValidation}
        modelMap={modelMap}
        manuscriptID={manuscriptID}
        bulkUpdate={bulkUpdate}
      />
      {requiredSectionValidation.length !== 0 && (
        <RequirementContainer
          result={requiredSectionValidation}
          title={'Required Section'}
        >
          <Requirement>
            {requiredSectionValidation.map(
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
      )}
      {bibliographyValidation.length !== 0 && (
        <RequirementContainer
          result={bibliographyValidation}
          title={'Bibliography'}
        >
          <Requirement>
            {bibliographyValidation.map(
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
      )}
      {figureValidation.length !== 0 && (
        <RequirementContainer result={figureValidation} title={'Figure'}>
          <Requirement>
            {figureValidation.map(
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
      )}
      {sectionOrderValidation.length !== 0 && (
        <RequirementContainer
          result={sectionOrderValidation}
          title={'Section Order'}
        >
          <Requirement>
            {sectionOrderValidation.map(
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
      )}
      {ignoredValidations.length !== 0 && (
        <RequirementContainer result={ignoredValidations} title={'Ignored'}>
          <Requirement>
            {ignoredValidations.map(
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
      )}
    </RequirementList>
  )
}
const RequirementList = styled.div`
  display: block;
`
const Requirement = styled.div`
  padding: 15px 0 0 0;
`
