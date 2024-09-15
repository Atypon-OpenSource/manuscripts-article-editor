/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */

import {
  CHANGE_OPERATION,
  CHANGE_STATUS,
  ChangeSet,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import React from 'react'
import styled from 'styled-components'

export const SuggestionSnippet: React.FC<{
  suggestion: TrackedChange
}> = ({ suggestion }) => {
  const { dataTracked } = suggestion

  const changeTitle = (c: TrackedChange) => {
    if (ChangeSet.isTextChange(c)) {
      return c.text
    } else if (
      ChangeSet.isNodeChange(c) &&
      c.dataTracked.operation === CHANGE_OPERATION.node_split
    ) {
      return `Split ${c.nodeType}`
    } else if (
      ChangeSet.isNodeChange(c) &&
      c.dataTracked.operation === CHANGE_OPERATION.wrap_with_node
    ) {
      return `${c.nodeType.charAt(0).toUpperCase()}${c.nodeType.slice(
        1
      )} insert`
    } else if (ChangeSet.isNodeChange(c)) {
      return `${c.nodeType.charAt(0).toUpperCase()}${c.nodeType.slice(1)} ${
        c.dataTracked.operation
      }`
    } else if (ChangeSet.isNodeAttrChange(c)) {
      return `${c.nodeType.charAt(0).toUpperCase()}${c.nodeType.slice(1)} ${
        c.dataTracked.operation
      }`
    }
    return 'Unknown change!'
  }

  return (
    <>
      <SnippetText isRejected={dataTracked.status === CHANGE_STATUS.rejected}>
        {dataTracked.operation === CHANGE_OPERATION.delete ? (
          <del>{changeTitle(suggestion)}</del>
        ) : (
          changeTitle(suggestion)
        )}
      </SnippetText>
    </>
  )
}

const Text = styled.div`
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`
const SnippetText = styled(Text)<{
  isRejected: boolean
}>`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.colors.text.primary};
`
