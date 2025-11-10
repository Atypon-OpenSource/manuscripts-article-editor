/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import styled from 'styled-components'

export const FileGroupContainer = styled.div`
  margin: 20px 0px 20px 15px;
`
export const FileGroupItemContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px 18px;

  .react-tooltip {
    max-width: 100% !important;
  }

  svg {
    width: 16px;

    path {
      fill: #6e6e6e;
    }
  }

  &.dragging {
    opacity: 0.2;
  }

  .show-on-hover {
    visibility: hidden;
  }

  &:hover .show-on-hover {
    visibility: visible;
  }

  &:hover,
  &:focus {
    background: #f2fbfc;
  }
`

export const FileGroup = styled.div`
  display: block;
`
export const FileLabel = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
  align-content: center;
`

export const FileGroupHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 20px;
  margin-bottom: 20px;

  .file-icon {
    margin-right: ${(props) =>
      props.theme.grid.unit * 2}px; /* Adjust as needed */
  }

  ${FileLabel} {
    flex: 1;
  }
`
