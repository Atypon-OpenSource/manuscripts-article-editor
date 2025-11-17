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

import { PrimaryButton, TertiaryButton } from '@manuscripts/style-guide'
import React from 'react'
import styled, { css } from 'styled-components'

const commonStyles = css`
  align-items: flex-start;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.grid.unit * 3}px;
`

const StyledSidebarHeader = styled.div`
  ${commonStyles};
  margin-bottom: ${(props) => props.theme.grid.unit * 6}px;
`

const StyledSidebarActionContainer = styled.div`
  margin-right: -16px;
`

export const SidebarTitle = styled.div`
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  user-select: none;
  white-space: nowrap;
  width: 100%;
`

export const SidebarFooter = styled.div`
  ${commonStyles};
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
`

interface SidebarHeaderInterface {
  action?: () => void
  cancelText?: string
  confirmText?: string
  isCancel?: boolean
  title: string | React.ReactNode
}

export const SidebarHeader: React.FunctionComponent<SidebarHeaderInterface> = ({
  action,
  isCancel,
  cancelText,
  confirmText,
  title,
}) => (
  <StyledSidebarHeader>
    <SidebarTitle>{title}</SidebarTitle>
    {action && (
      <StyledSidebarActionContainer>
        {isCancel ? (
          <TertiaryButton mini={true} onClick={action}>
            {cancelText || 'Cancel'}
          </TertiaryButton>
        ) : (
          <PrimaryButton mini={true} onClick={action}>
            {confirmText || 'Done'}
          </PrimaryButton>
        )}
      </StyledSidebarActionContainer>
    )}
  </StyledSidebarHeader>
)
