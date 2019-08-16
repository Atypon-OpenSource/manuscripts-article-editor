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

import { TitleEditorView, TitleField } from '@manuscripts/title-editor'
import React from 'react'
import { useSyncedData } from '../../hooks/use-synced-data'
import { styled } from '../../theme/styled-components'

export const TitleFieldContainer: React.FC<{
  editable: boolean
  title: string
  handleChange: (title: string) => void
  handleStateChange: (view: TitleEditorView, docChanged: boolean) => void
}> = ({ editable, title, handleChange, handleStateChange }) => {
  const [value, setValue, setEditing] = useSyncedData<string>(
    title,
    handleChange
  )

  return (
    <StyledTitleField
      id={'manuscript-title-field'}
      autoFocus={!title}
      editable={editable}
      value={value}
      handleChange={setValue}
      handleFocused={setEditing}
      handleStateChange={handleStateChange}
      tabIndex={2}
    />
  )
}

const StyledTitleField = styled(TitleField)`
  flex: 1;

  & .ProseMirror {
    cursor: text;
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.3;

    &:focus {
      outline: none;
    }

    &.empty-node::before {
      position: absolute;
      color: #ccc;
      cursor: text;
      content: 'Untitled Manuscript';
      pointer-events: none;
    }

    &.empty-node:hover::before {
      color: #999;
    }
  }
`
