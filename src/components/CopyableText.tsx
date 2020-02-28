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

import copyToClipboard from 'clipboard-copy'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

enum CopyState {
  Ready = 'ready',
  Copied = 'copied',
  Failed = 'failed',
}

export const StyledButton = styled.button<{ copyState: CopyState }>`
  background: transparent;
  border: none;
  font-size: inherit;
  color: ${props =>
    props.copyState === CopyState.Failed
      ? props.theme.colors.text.error
      : props.theme.colors.text.info};
  display: inline;
  padding: 0;
  cursor: pointer;

  &:focus {
    outline: 1px solid ${props => props.theme.colors.button.default.color.hover};
  }
`

interface Props {
  text: string
  onCopy?: (text: string) => void
}

export const CopyableText: React.FC<Props> = ({ text, onCopy, children }) => {
  const [copyState, setCopyState] = useState<CopyState>(CopyState.Ready)

  const copy = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault()
      copyToClipboard(text)
        .then(() => setCopyState(CopyState.Copied))
        .catch(() => setCopyState(CopyState.Failed))
      onCopy && onCopy(text)
    },
    [text, onCopy]
  )

  // reset the copy state if the text changes
  useEffect(() => {
    setCopyState(CopyState.Ready)
  }, [text])

  return (
    <StyledButton type="button" onClick={copy} copyState={copyState}>
      {copyState === CopyState.Ready
        ? children
        : copyState === CopyState.Copied
        ? 'Copied!'
        : 'Failed to copy to clipboard'}
    </StyledButton>
  )
}
