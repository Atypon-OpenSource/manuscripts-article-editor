/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

export const IndentedSubheading = styled(Subheading)`
  margin-left: 8px;
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
