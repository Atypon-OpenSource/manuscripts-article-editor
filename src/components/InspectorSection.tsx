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
  ArrowDownCircleIcon,
  IconButton,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useState } from 'react'
import styled from 'styled-components'

import ApproveAllButton from './track-changes/ApproveAllButton'

const Section = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
  font-size: ${(props) => props.theme.font.size.small};
  margin: ${(props) => props.theme.grid.unit * 6}px
    ${(props) => props.theme.grid.unit * 7}px 0;
`

const Heading = styled.div`
  display: flex;
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
  cursor: pointer;
`

const HeadingText = styled.div`
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  flex: 1;
`

export const Subheading = styled(HeadingText)`
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.normal};
  margin-bottom: ${(props) => props.theme.grid.unit * 3}px;

  &:not(:first-child) {
    margin-top: ${(props) => props.theme.grid.unit * 6}px;
  }
`

export const Field = styled.div`
  margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
`

export const ExpanderButton = styled(IconButton).attrs(() => ({
  size: 20,
  defaultColor: true,
}))`
  border: none;
  border-radius: 50%;

  &:focus,
  &:hover {
    &:not([disabled]) {
      background: ${(props) => props.theme.colors.background.fifth};
    }
  }

  svg circle {
    stroke: ${(props) => props.theme.colors.border.secondary};
  }
`

const Content = styled.div`
  margin: 0;
`

interface Props {
  title: React.ReactNode
  children?: React.ReactNode
  approveAll?: () => void
  fixed?: boolean
}

export const InspectorSection: React.FC<Props> = ({
  title,
  children,
  approveAll,
  fixed,
}) => {
  const [expanded, setExpanded] = useState(true)
  const can = usePermissions()

  return (
    <Section>
      <Heading onClick={() => setExpanded(!expanded)}>
        <HeadingText>{title}</HeadingText>
        {approveAll && can.handleSuggestion && (
          <ApproveAllButton approveAll={approveAll} />
        )}

        {!fixed && (
          <ExpanderButton
            aria-label={'Toggle expand section'}
            onClick={() => setExpanded(!expanded)}
            style={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          >
            <ArrowDownCircleIcon />
          </ExpanderButton>
        )}
      </Heading>

      {(expanded || fixed) && <Content>{children}</Content>}
    </Section>
  )
}
