/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */

import styled, { css } from 'styled-components'

const buttonCss = css<{
  'data-active'?: boolean
}>`
  background-color: ${(props) =>
    props['data-active'] ? '#eee' : props.theme.colors.background.primary};
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: 0.2s all;

  &:hover {
    background: ${(props) =>
      props['data-active'] ? '#eee' : props.theme.colors.background.secondary};
    z-index: 2;
  }

  &:active {
    background: #ddd;
  }

  &:disabled {
    opacity: 0.2;
  }
`

export const ListButton = styled.button.attrs({
  type: 'button',
  'data-toolbar-button': true,
})<{
  'data-active'?: boolean
}>`
  ${buttonCss};
  padding: ${(props) => props.theme.grid.unit * 2 - 1}px
    ${(props) => props.theme.grid.unit * 1}px
    ${(props) => props.theme.grid.unit * 2 - 1}px
    ${(props) => props.theme.grid.unit * 2}px;
  border-right: 0;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
`

export const ListStyleButton = styled.button.attrs({
  type: 'button',
  'data-toolbar-button': true,
})<{
  'data-active'?: boolean
}>`
  ${buttonCss};
  border-left: 0;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  svg {
    width: 8px;
  }
  path {
    stroke: #c9c9c9;
  }

  &:hover path {
    stroke: #6e6e6e;
  }
`
