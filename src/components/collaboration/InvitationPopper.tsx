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

import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { GreyButton, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { TokenActions } from '../../data/TokenData'
import { isOwner } from '../../lib/roles'
import { styled } from '../../theme/styled-components'
import { PopperBody } from '../Popper'
import { InvitationForm, InvitationValues } from './InvitationForm'

const LinkButton = styled(GreyButton)`
  width: 70px;
  text-transform: none;
`

const InviteButton = styled(PrimaryButton)`
  width: 70px;
  text-transform: none;
`

export const ShareProjectHeader = styled.div`
  display: flex;
  padding-bottom: 29px;
  justify-content: space-between;
`

export const ShareProjectTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.9px;
  color: ${props => props.theme.colors.popper.text.primary};
  display: inline-block;
  padding-right: 20px;
  font-family: ${props => props.theme.fontFamily};
`

interface Props {
  project: Project
  user: UserProfile
  handleInvitationSubmit: (values: InvitationValues) => Promise<void>
  handleSwitching: (page: boolean) => void
  tokenActions: TokenActions
}

export const InvitationPopper: React.FunctionComponent<Props> = ({
  user,
  project,
  handleSwitching,
  handleInvitationSubmit,
  tokenActions,
}) => {
  const isProjectOwner = isOwner(project, user.userID)

  return (
    <PopperBody>
      <ShareProjectHeader>
        <ShareProjectTitle>Share Project</ShareProjectTitle>
        <div>
          <LinkButton onClick={() => handleSwitching(false)}>Link</LinkButton>
          <InviteButton>Invite</InviteButton>
        </div>
      </ShareProjectHeader>
      <InvitationForm
        allowSubmit={isProjectOwner}
        handleSubmit={handleInvitationSubmit}
        tokenActions={tokenActions}
      />
    </PopperBody>
  )
}
