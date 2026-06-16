/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2026 Atypon Systems LLC. All Rights Reserved.
 */

import React, { useMemo } from 'react'
import {
  FileAttachment,
  NodeWeblink
} from '@manuscripts/body-editor'
import {
  WebLinkIcon
} from '@manuscripts/style-guide'

import { FileName } from '../FileName'
import { WeblinkActions } from './WeblinkActions'
import styled from 'styled-components'
import { FileContainer } from '../FileContainer'


type WeblinkEntryProps = {
  weblink: NodeWeblink
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  canEdit: boolean
}

const toWeblinkFile = (weblink: NodeWeblink): FileAttachment => ({
  id: weblink.node.attrs.href,
  name: weblink.node.attrs.href,
})

export const WeblinkEntry = ({
  weblink,
  onClick,
  onEdit,
  onDelete,
  canEdit,
}: WeblinkEntryProps) => {
  const file = toWeblinkFile(weblink)
  const captionTitle = useMemo(
    () => weblink.node.firstChild?.textContent.trim() ?? '',
    [weblink.node]
  )

  return (
    <WeblinkContainer
      data-cy="weblink-container"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.currentTarget === document.activeElement) {
          onClick()
        }
      }}
    >
      <WeblinkInfo>
        <FileName file={file} icon={WebLinkIcon} maxBaseNameLength={28} />
        {captionTitle && (
          <WeblinkCaptionTitle data-cy="weblink-caption-title">
            {captionTitle}
          </WeblinkCaptionTitle>
        ) //: null
        }
      </WeblinkInfo>
      {canEdit && <WeblinkActions onEdit={onEdit} onDelete={onDelete} />}
    </WeblinkContainer>
  )
}

const WeblinkContainer = styled(FileContainer)`
  padding: 8px 16px;
  height: auto;
`

const WeblinkInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 2px;
`

const WeblinkCaptionTitle = styled.div`
  font-family: ${(props) => props.theme.font.family.Lato};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
  color: ${(props) => props.theme.colors.text.greyMuted};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`