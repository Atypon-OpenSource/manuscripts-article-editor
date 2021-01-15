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

// import CloseIcon from '@manuscripts/assets/react/CloseIconDark'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Correction as CorrectionT } from '@manuscripts/manuscripts-json-schema'
import { CommentUser } from '@manuscripts/style-guide'
import React, { useCallback } from 'react'
import styled from 'styled-components'

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
    <Wrapper
      isFocused={isFocused}
      isRejected={correction.status === 'rejected'}
    >
      <Header>
        <FocusHandle href="#" onClick={handleClick}>
          <CommentUser
            contributions={correction.contributions}
            getCollaboratorById={getCollaboratorById}
            createdAt={correction.contributions![0].timestamp * 1000}
          />
        </FocusHandle>
        <div>
          <Action type="button" onClick={() => handleReject(correction._id)}>
            ☒
          </Action>
          <Action type="button" onClick={() => handleAccept(correction._id)}>
            ☑
          </Action>
        </div>
      </Header>
      <Snippet>{correction.snippet}</Snippet>
    </Wrapper>
  )
}

const Wrapper = styled.li<{
  isFocused: boolean
  isRejected: boolean
}>`
  margin: 2rem 0;
  padding: 0;
  list-style-type: none;
  opacity: ${(props) => (props.isRejected ? 0.5 : 1)};

  /* FocusHandle should cover entire card: */
  position: relative;
`

const FocusHandle = styled.a`
  color: inherit;
  text-decoration: none;
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
  background: transparent;
  margin: 0 1em;
  border: 1px solid black;
  padding: 0;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: relative;
  z-index: 1;
`

const Snippet = styled.div`
  font-size: 0.85rem;
`
