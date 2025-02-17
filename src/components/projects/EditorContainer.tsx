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

import styled from 'styled-components'

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.theme.grid.unit * 8}px;
  right: ${(props) => props.theme.grid.unit * 8}px;
  overflow: hidden;
  background: ${(props) => props.theme.colors.background.primary};
`

export const EditorContainerInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  background: ${(props) => props.theme.colors.background.primary};
  border-bottom: none;
  border-top: none;
`

export const EditorHeader = styled.div`
  background: ${(props) => props.theme.colors.background.primary};
  z-index: 6;
  position: relative;
  border-bottom: 1px solid #f2f2f2;
`

export const EditorBody = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: ${(props) => props.theme.grid.unit * 5}px
    ${(props) => props.theme.grid.unit * 2}px 0;
  max-width: ${(props) => props.theme.grid.editorMaxWidth}px;
  @media (min-width: ${(props) => props.theme.grid.tablet}px) {
    margin: 0 auto;
  }
`
