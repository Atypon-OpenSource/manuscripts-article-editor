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
  ModalMain,
  PrimaryButton,
  TertiaryButton,
  TextField,
} from '@manuscripts/style-guide'
import React from 'react'
import { css, styled } from '../theme/styled-components'

const SidebarCommonStyles = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${props => props.theme.grid.unit * 4}px
    ${props => props.theme.grid.unit * 2}px;
  width: 100%;
`
export const Sidebar = styled.div`
  ${SidebarCommonStyles}
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.tertiary};
`

export const ModalSidebar = styled.div`
  ${SidebarCommonStyles}
  background-color: ${props => props.theme.colors.background.fifth};
  border-top-left-radius: ${props => props.theme.grid.radius.default};
  border-bottom-left-radius: ${props => props.theme.grid.radius.default};
  max-width: 40vw;
  overflow: auto;
  width: 280px;
`

export const StyledModalMain = styled(ModalMain)`
  box-sizing: border-box;
  max-width: 60vw;
  width: 480px;
`

export const ModalBody = styled.div`
  align-items: stretch;
  display: flex;
  flex: 1;
  height: 90vh;
  max-height: 680px;
`

const commonStyles = css`
  align-items: flex-start;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 0 ${props => props.theme.grid.unit * 3}px;
`

const StyledSidebarHeader = styled.div`
  ${commonStyles}
  margin-bottom: ${props => props.theme.grid.unit * 7}px
  min-height: ${props => props.theme.grid.unit * 10}px;
`

const StyledSidebarActionContainer = styled.div`
  margin-right: -16px;
`

export const SidebarFooter = styled.div`
  ${commonStyles}
  margin-top: ${props => props.theme.grid.unit * 4}px;
`

export const SidebarTitle = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.semibold};
  color: ${props => props.theme.colors.text.primary};
  user-select: none;
  white-space: nowrap;
  width: 100%;
`

interface SidebarHeaderInterface {
  action?: () => void
  cancelText?: string
  confirmText?: string
  isCancel?: boolean
  title: string | JSX.Element
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

export const SidebarContent = styled.div`
  flex: 1;
  padding: 0 ${props => props.theme.grid.unit * 3}px;
  position: relative;
  flex-shrink: 0;
`

export const SidebarSearchField = styled(SidebarContent)`
  align-items: center;
  display: flex;
  flex: 0;
`

interface SidebarPersonContainerProps {
  selected?: boolean
}

export const SidebarPersonContainer = styled.div<SidebarPersonContainerProps>`
  align-items: center;
  background-color: ${props =>
    props.selected ? props.theme.colors.brand.xlight : 'unset'};
  border: 1px solid transparent;
  border-left: 0;
  border-right: 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin: 0 -${props => props.theme.grid.unit * 5}px;
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 5}px;

  &:hover {
    border-color: ${props => props.theme.colors.border.primary};
    background-color: ${props => props.theme.colors.background.fifth};
  }
`

export const SidebarSearchText = styled(TextField)`
  border: none;
  border-radius: ${props => props.theme.grid.radius.default};
  left: -${props => props.theme.grid.unit * 4}px;
  padding-left: ${props => props.theme.grid.unit * 5}px;
  &:hover,
  &:focus {
    background-color: ${props => props.theme.colors.background.fifth};
  }
`

export const SidebarSearchIconContainer = styled.span`
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`
