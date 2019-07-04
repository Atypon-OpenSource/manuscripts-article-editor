/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
