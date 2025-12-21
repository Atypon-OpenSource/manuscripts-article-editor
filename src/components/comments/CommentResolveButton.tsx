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

import { Comment } from '@manuscripts/body-editor'
import { CommentResolveIcon } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
  display: flex;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

  &.resolved {
    background: #f2fbfc;
    border: 1px solid #bce7f6;
    path {
      fill: #1a9bc7;
    }
  }

  &:not([disabled]):hover,
  &:not([disabled]):active {
    path {
      fill: #1a9bc7;
    }
    background: #f2fbfc;
    border: 1px solid #c9c9c9;
  }
`

export interface CommentResolveButtonProps {
  comment: Comment
  onClick: () => void
}

export const CommentResolveButton: React.FC<CommentResolveButtonProps> = ({
  comment,
  onClick,
}) => {
    const label = comment.node.attrs.resolved ? 'Unresolve Comment' : 'Resolve Comment';
    return (
        <Button
            className={comment.node.attrs.resolved ? 'resolved' : ''}
            onClick={onClick}
            aria-label={label}
            data-tooltip-content={label}
        >
            <CommentResolveIcon />
        </Button>
  )
}
