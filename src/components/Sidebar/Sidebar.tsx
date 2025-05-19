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

import styled, { css } from 'styled-components'

const SidebarCommonStyles = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 2}px;
  width: 100%;
  overflow: hidden;
`

export const Sidebar = styled.div`
  ${SidebarCommonStyles};
  background: ${(props) => props.theme.colors.background.secondary};
  border-right: 1px solid ${(props) => props.theme.colors.border.tertiary};
`

export const ModalSidebar = styled.div`
  ${SidebarCommonStyles};
  background-color: ${(props) => props.theme.colors.background.secondary};
  border-top-left-radius: ${(props) => props.theme.grid.radius.default};
  border-bottom-left-radius: ${(props) => props.theme.grid.radius.default};
  max-width: 40vw;
  overflow: auto;
  width: 340px;
`

export const StyledModalMain = styled.div`
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

export const SidebarContent = styled.div`
  flex: 1;
  padding: 0 ${(props) => props.theme.grid.unit * 3}px;
  position: relative;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
`
