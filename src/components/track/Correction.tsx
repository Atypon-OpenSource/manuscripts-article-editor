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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Correction as CorrectionT } from '@manuscripts/manuscripts-json-schema'
import { CommentUser } from '@manuscripts/style-guide'
import React, { useCallback } from 'react'
import styled from 'styled-components'

import { Accept, Reject } from './Icons'

interface Props {
  correction: CorrectionT
  isFocused: boolean
  getCollaboratorById: (
    userProfileId: string
  ) => UserProfileWithAvatar | undefined
  handleFocus: (correctionID: string) => void
  handleAccept: (correctionID: string) => void
  handleReject: (correctionID: string) => void
}

export const Correction: React.FC<Props> = ({
  correction,
  isFocused,
  getCollaboratorById,
  handleFocus,
  handleAccept,
  handleReject,
}) => {
  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      handleFocus(correction._id)
    },
    [handleFocus, correction]
  )

  return (
    <Wrapper isFocused={isFocused}>
      <Header>
        <FocusHandle
          href="#"
          onClick={handleClick}
          isDisabled={correction.status === 'rejected'}
        >
          <CommentUser
            contributions={correction.contributions}
            getCollaboratorById={getCollaboratorById}
            createdAt={correction.contributions![0].timestamp * 1000}
          />
        </FocusHandle>
        <div>
          <Action
            type="button"
            onClick={() => handleReject(correction._id)}
            aria-pressed={correction.status === 'rejected'}
          >
            <Reject color="#353535" />
          </Action>
          <Action
            type="button"
            onClick={() => handleAccept(correction._id)}
            aria-pressed={correction.status === 'accepted'}
          >
            <Accept color="#353535" />
          </Action>
        </div>
      </Header>
      <Snippet isRejected={correction.status === 'rejected'}>
        {correction.snippet}
      </Snippet>
    </Wrapper>
  )
}

const Wrapper = styled.li<{
  isFocused: boolean
}>`
  margin: 2rem 0;
  padding: 0;
  list-style-type: none;

  /* FocusHandle should cover entire card: */
  position: relative;
`

const FocusHandle = styled.a<{
  isDisabled: boolean
}>`
  color: inherit;
  text-decoration: none;
  pointer-events: ${(props) => (props.isDisabled ? 'none' : 'all')};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
  &:after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Action = styled.button`
  background-color: transparent;
  margin: 0 1em;
  border: 1px solid transparent;
  border-radius: 50%;
  padding: 0;
  width: 24px;
  height: 24px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;

  &[aria-pressed='true'] {
    border-color: #bce7f6;
    background-color: #f2fbfc;
    svg path {
      fill: #1a9bc7;
    }
  }
`

const Snippet = styled.div<{
  isRejected: boolean
}>`
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.5em 25px 0;
  opacity: ${(props) => (props.isRejected ? 0.5 : 1)};
`
