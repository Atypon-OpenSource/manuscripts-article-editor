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
import React, { useCallback, useMemo } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import { AvatarContainer, CorrectionItem, Time } from './CorrectionItem'
import { Accept, Back, Reject } from './Icons'

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
  user: UserProfileWithAvatar
}

export const Correction: React.FC<Props> = ({
  correction,
  isFocused,
  getCollaboratorById,
  handleFocus,
  handleAccept,
  handleReject,
  project,
  user,
}) => {
  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      handleFocus(correction._id)
    },
    [handleFocus, correction]
  )

  const can = usePermissions()

  const canRejectOwnSuggestion = useMemo(() => {
    if (
      can.handleSuggestion ||
      (can.rejectOwnSuggestion &&
        correction.status.label === 'proposed' &&
        correction.status.editorProfileID === user._id)
    ) {
      return true
    }
    return false
  }, [correction, can, user._id])

  const isRejected = useMemo(() => {
    return correction.status.label === 'rejected'
  }, [correction])

  const isAccepted = useMemo(() => {
    return correction.status.label === 'accepted'
  }, [correction])

  return (
    <Wrapper isFocused={isFocused}>
      <FocusHandle href="#" onClick={handleClick} isDisabled={isRejected}>
        <CorrectionItem
          correction={correction}
          getCollaboratorById={getCollaboratorById}
          project={project}
        />
      </FocusHandle>

      <Actions>
        <>
          {canRejectOwnSuggestion && (
            <Container>
              <Action
                type="button"
                onClick={() => handleReject(correction._id)}
                aria-pressed={isRejected}
                data-tip={true}
                data-for={isRejected ? 'back' : 'reject'}
              >
                {isRejected ? (
                  <Back color="#353535" />
                ) : (
                  <Reject color="#353535" />
                )}
              </Action>
              <ReactTooltip
                id={isRejected ? 'back' : 'reject'}
                place="bottom"
                effect="solid"
                offset={{ top: 10 }}
                className="tooltip"
              >
                {(isRejected && 'Back to suggestions') || 'Reject'}
              </ReactTooltip>
            </Container>
          )}
          {can.handleSuggestion && (
            <Container>
              <Action
                type="button"
                onClick={() => handleAccept(correction._id)}
                aria-pressed={isAccepted}
                data-tip={true}
                data-for={isAccepted ? 'back' : 'accept'}
              >
                {isAccepted ? (
                  <Back color="#353535" />
                ) : (
                  <Accept color="#353535" />
                )}
              </Action>
              <ReactTooltip
                id={isAccepted ? 'back' : 'accept'}
                place="bottom"
                effect="solid"
                offset={{ top: 10 }}
                className="tooltip"
              >
                {(isAccepted && 'Back to suggestions') || 'Approve'}
              </ReactTooltip>
            </Container>
          )}
        </>
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
  width: ${(props) => props.theme.grid.unit * 6}px;
  height: ${(props) => props.theme.grid.unit * 6}px;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:not([disabled]):hover {
    &[aria-pressed='true'] {
      path {
        stroke: #1a9bc7;
      }
    }

    &[aria-pressed='false'] {
      path {
        fill: #1a9bc7;
      }
    }
    background: #f2fbfc;
    border: 1px solid #c9c9c9;
  }

  &:focus {
    outline: none;
  }
`

const Container = styled.div`
  .tooltip {
    border-radius: 6px;
    padding: ${(props) => props.theme.grid.unit * 2}px;
    max-width: ${(props) => props.theme.grid.unit * 15}px;
    font-size: ${(props) => props.theme.grid.unit * 3}px;
  }
`
