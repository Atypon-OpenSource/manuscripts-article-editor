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

import { PrimaryButton, TertiaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { TokenActions } from '../../data/TokenData'
import { styled } from '../../theme/styled-components'
import { Sidebar, SidebarHeader, SidebarTitle } from '../Sidebar'
import { InvitationForm, InvitationValues } from './InvitationForm'

const FormContainer = styled.div`
  padding: ${props => props.theme.grid.unit * 3}px;
`
const Container = styled.div`
  padding-top: ${props => props.theme.grid.unit}px;
`

const StyledSidebar = styled(Sidebar)<{ isModal?: boolean }>`
  background: ${props =>
    props.isModal
      ? props.theme.colors.background.secondary
      : props.theme.colors.background.primary};
  border-right: ${props =>
    props.isModal
      ? `none`
      : `1px solid
      ${props.theme.colors.background.info}`};
`

interface Props {
  invitationValues: InvitationValues
  handleCancel: () => void
  handleSubmit: (values: InvitationValues) => Promise<void>
  invitationSent: boolean
  isModal?: boolean
  tokenActions: TokenActions
}

const InviteCollaboratorsSidebar: React.FunctionComponent<Props> = ({
  invitationValues,
  handleCancel,
  handleSubmit,
  invitationSent,
  isModal,
  tokenActions,
}) => (
  <StyledSidebar isModal={isModal}>
    <SidebarHeader>
      <SidebarTitle>Invite</SidebarTitle>
      {!invitationSent ? (
        <Container>
          <TertiaryButton onClick={handleCancel}>Cancel</TertiaryButton>
        </Container>
      ) : (
        <PrimaryButton onClick={handleCancel}>Done</PrimaryButton>
      )}
    </SidebarHeader>
    <FormContainer>
      <InvitationForm
        allowSubmit={true}
        invitationValues={invitationValues}
        handleSubmit={handleSubmit}
        tokenActions={tokenActions}
      />
    </FormContainer>
  </StyledSidebar>
)

export default InviteCollaboratorsSidebar
