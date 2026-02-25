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
import { format } from 'date-fns'
import React from 'react'
import styled from 'styled-components'

export const FileCreatedDate: React.FC<{
  file: FileAttachment
  className?: string
}> = ({ file, className }) => {
  if (!file.createdDate) {
    return null
  }

  return (
    <FileDateContainer
      className={className}
      data-tooltip-content="File Uploaded"
    >
      <FileDate>{format(new Date(file.createdDate), 'M/d/yy, HH:mm')}</FileDate>
    </FileDateContainer>
  )
}

export const FileDateContainer = styled.div`
  overflow: hidden;
  min-width: 88px;
  margin-left: 8px;
`

export const FileDate = styled.div`
  font-size: ${(props) => props.theme.font.size.small};
  line-height: 27px;
`
