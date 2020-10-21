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

import React, { useMemo } from 'react'
import styled from 'styled-components'

import { AnyValidationResult } from '../../lib/validations'
import { RequirementContainer } from './RequirementContainer'
import { RequirementsData } from './RequirementsData'
import { SectionValidations } from './SectionValidations'

export const RequirementsList: React.FC<{
  validationResult: AnyValidationResult[]
}> = ({ validationResult }) => {
  const sortedData = useMemo(
    () =>
      [...validationResult].sort((a, b) =>
        a.passed === b.passed ? 0 : a ? -1 : 1
      ),
    [validationResult]
  )
  const manuscriptValidation = sortedData.filter((node: AnyValidationResult) =>
    node.type.startsWith('manuscript-')
  )
  const bibliographyValidation = sortedData.filter(
    (node: AnyValidationResult) => node.type.startsWith('bibliography-')
  )
  const figureValidation = sortedData.filter((node: AnyValidationResult) =>
    node.type.startsWith('figure-')
  )
  const requiredSectionValidation = sortedData.filter(
    (node: AnyValidationResult) => node.type === 'required-section'
  )
  const sectionOrderValidation = sortedData.filter(
    (node: AnyValidationResult) => node.type === 'section-order'
  )

  return (
    <RequirementList>
      {manuscriptValidation.length !== 0 && (
        <RequirementContainer title={'Manuscript'}>
          <Requirement>
            {manuscriptValidation.map((section: AnyValidationResult) => (
              <RequirementsData node={section} key={section._id} />
            ))}
          </Requirement>
          <Separator />
        </RequirementContainer>
      )}
      <SectionValidations sortedData={sortedData} />
      {requiredSectionValidation.length !== 0 && (
        <RequirementContainer title={'Required Section'}>
          <Requirement>
            {requiredSectionValidation.map((section: AnyValidationResult) => (
              <RequirementsData node={section} key={section._id} />
            ))}
          </Requirement>
          <Separator />
        </RequirementContainer>
      )}
      {bibliographyValidation.length !== 0 && (
        <RequirementContainer title={'Bibliography'}>
          <Requirement>
            {bibliographyValidation.map((section: AnyValidationResult) => (
              <RequirementsData node={section} key={section._id} />
            ))}
          </Requirement>
          <Separator />
        </RequirementContainer>
      )}
      {figureValidation.length !== 0 && (
        <RequirementContainer title={'Figure'}>
          <Requirement>
            {figureValidation.map((section: AnyValidationResult) => (
              <RequirementsData node={section} key={section._id} />
            ))}
          </Requirement>
          <Separator />
        </RequirementContainer>
      )}
      {sectionOrderValidation.length !== 0 && (
        <RequirementContainer title={'Section Order'}>
          <Requirement>
            {sectionOrderValidation.map((section: AnyValidationResult) => (
              <RequirementsData node={section} key={section._id} />
            ))}
          </Requirement>
          <Separator />
        </RequirementContainer>
      )}
    </RequirementList>
  )
}

const Separator = styled.div`
  margin: 0 8px 0 8px;
  border: 1px solid #f2f2f2;
`
const RequirementList = styled.div`
  display: block;
`
const Requirement = styled.div`
  padding: 15px 0 0 0;
`
