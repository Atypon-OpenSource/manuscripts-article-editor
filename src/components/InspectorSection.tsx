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

import ArrowDownBlue from '@manuscripts/assets/react/ArrowDownBlue'
import React, { useState } from 'react'
import { styled } from '../theme/styled-components'

const Section = styled.div`
  border-top: 1px solid #e2e2e2;
  padding: 16px 0;
  font-size: 14px;

  &:last-child {
    border-bottom: 1px solid #e2e2e2;
  }
`

const Heading = styled.div`
  display: flex;
  padding: 8px;
  cursor: pointer;
`

const HeadingText = styled.div`
  font-size: 18px;
  color: #777;
  flex: 1;
`

export const Subheading = styled(HeadingText)`
  font-size: 16px;
  margin-bottom: 12px;

  &:not(:first-child) {
    margin-top: 24px;
  }
`

export const Field = styled.div`
  margin-bottom: 16px;
`

const ExpanderButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const Content = styled.div`
  padding: 8px;
`

interface Props {
  title: React.ReactNode
}

export const InspectorSection: React.FC<Props> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <Section>
      <Heading onClick={() => setExpanded(!expanded)}>
        <HeadingText>{title}</HeadingText>
        <ExpanderButton
          style={{
            transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        >
          <ArrowDownBlue />
        </ExpanderButton>
      </Heading>
      {expanded && <Content>{children}</Content>}
    </Section>
  )
}
