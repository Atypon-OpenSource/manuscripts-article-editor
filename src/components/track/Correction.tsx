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
import {
  Correction as CorrectionT,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { usePermissions } from '@manuscripts/style-guide'
import React, { useCallback } from 'react'
import styled from 'styled-components'

import { AvatarContainer, CorrectionItem, Time } from './CorrectionItem'
import { Accept, Reject } from './Icons'

interface Props {
  project: Project
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
  project,
}) => {
  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      handleFocus(correction._id)
    },
    [handleFocus, correction]
  )

  const can = usePermissions()

  return (
    <Wrapper isFocused={isFocused}>
      <FocusHandle
        href="#"
        onClick={handleClick}
        isDisabled={correction.status.label === 'rejected'}
      >
        <CorrectionItem
          correction={correction}
          getCollaboratorById={getCollaboratorById}
          project={project}
        />
      </FocusHandle>

      <Actions>
        {can.handleSuggestion && (
          <>
            <Action
              type="button"
              onClick={() => handleReject(correction._id)}
              aria-pressed={correction.status.label === 'rejected'}
              disabled={!can.handleSuggestion}
            >
              <Reject color="#353535" />
            </Action>
            <Action
              type="button"
              onClick={() => handleAccept(correction._id)}
              aria-pressed={correction.status.label === 'accepted'}
              disabled={!can.handleSuggestion}
            >
              <Accept color="#353535" />
            </Action>
          </>
        )}
      </Actions>
    </Wrapper>
  )
}

const Actions = styled.div`
  display: flex;
  visibility: hidden;
`

const Wrapper = styled.li<{
  isFocused: boolean
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 3}px
    ${(props) => props.theme.grid.unit * 2}px !important;
  border-top: 1px solid ${(props) => props.theme.colors.background.secondary};
  list-style-type: none;

  /* FocusHandle should cover entire card: */
  position: relative;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth} !important;

    ${AvatarContainer}, ${Actions}, ${Time} {
      visibility: visible;
    }
  }
`

const FocusHandle = styled.a<{
  isDisabled: boolean
}>`
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  pointer-events: ${(props) => (props.isDisabled ? 'none' : 'all')};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
  overflow: hidden;
`

const Action = styled.button`
  background-color: transparent;
  margin: 0 ${(props) => props.theme.grid.unit * 2}px;
  border: 1px solid transparent;
  border-radius: 50%;
  padding: 0;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }
`
