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
import { FileAttachment } from '@manuscripts/body-editor'
import React from 'react'
import styled from 'styled-components'

import { trimFilename } from '../../lib/files'
import { FileTypeIcon } from './FileTypeIcon'

export const FileName: React.FC<{
  file: FileAttachment
  icon?: React.FC<React.SVGAttributes<SVGElement>>
  label?: string
  maxBaseNameLength?: number
}> = ({ file, label, icon: Icon, maxBaseNameLength = 25 }) => {
  const trimmedFilename = trimFilename(file.name, maxBaseNameLength)
  return (
    <FileNameContainer data-tooltip-content={file.name}>
      {(Icon && <Icon className="file-icon" />) || <FileTypeIcon file={file} />}
      {label && <FileLabel>{label}:</FileLabel>}
      <FileNameText data-cy="filename">{trimmedFilename}</FileNameText>
    </FileNameContainer>
  )
}

export const FileNameText = styled.div`
  font-family: ${(props) => props.theme.font.family.Lato};
  font-size: ${(props) => props.theme.font.size.medium};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  font-weight: ${(props) => props.theme.font.weight.normal};
  color: ${(props) => props.theme.colors.text.primary};
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const FileNameContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  .react-tooltip {
    max-width: 100% !important;
  }
`

const FileLabel = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  align-content: center;
`
