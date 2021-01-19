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

import { AnyValidationResult } from '@manuscripts/requirements'
import React, { useState } from 'react'
import styled from 'styled-components'

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ValidationDangerIcon,
  ValidationPassedIcon,
} from './RequirementsIcons'

interface Props {
  title: React.ReactNode
  result: AnyValidationResult[]
}

export const RequirementContainer: React.FC<Props> = ({
  title,
  result,
  children,
}) => {
  const [expanded, setExpanded] = useState(true)
  const failedResults = result.filter(
    (node: AnyValidationResult) => !node.passed
  )

  return (
    <Container>
      {failedResults.length === 0 ? (
        <Data>
          <Icon>
            <ValidationPassedIcon />
          </Icon>
          <Title>{title}</Title>
        </Data>
      ) : (
        <Data onClick={() => setExpanded(!expanded)}>
          <Icon>
            <ValidationDangerIcon />
          </Icon>
          <Title>{title}</Title>
          <ExpanderButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </ExpanderButton>
        </Data>
      )}
      {expanded && <>{children}</>}
    </Container>
  )
}

const ExpanderButton = styled.div`
  cursor: pointer;
`
const Container = styled.div`
  padding: 0 0 16px 0;
`
const Title = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  flex: 0.96;
  cursor: pointer;
`
const Icon = styled.div`
  display: inline-flex;
  padding: 3px 11px 0 0;
`
const Data = styled.div`
  display: flex;
  padding: 20px 0 0 21px;
`
