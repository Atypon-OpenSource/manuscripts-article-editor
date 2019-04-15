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

import ArrowDownUp from '@manuscripts/assets/react/ArrowDownUp'
import { MiniButton } from '@manuscripts/style-guide'
import React, { useState } from 'react'
import { styled } from '../theme/styled-components'

const Section = styled.div`
  border-bottom: 1px solid #e2e2e2;
  border-top: 1px solid #e2e2e2;
  padding: 16px 0;
  font-size: 14px;
`

const Heading = styled.div`
  display: flex;
  padding: 8px;
  cursor: pointer;
`

const HeadingText = styled.div`
  font-weight: bold;
  font-size: 14px;
  flex: 1;
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

export const InspectorField = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const InspectorLabel = styled.div`
  flex-shrink: 0;
  width: 100px;
  color: ${props => props.theme.colors.global.text.secondary};
`

export const InspectorValue = styled.div`
  padding-left: 20px;
  position: relative;
  font-size: 90%;
  flex: 1;
  display: flex;

  ${MiniButton} {
    position: absolute;
    right: 0px;
    top: 1px;
  }
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
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ArrowDownUp />
        </ExpanderButton>
      </Heading>
      {expanded && <Content>{children}</Content>}
    </Section>
  )
}
