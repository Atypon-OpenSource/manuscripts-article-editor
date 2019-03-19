/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GreyButton, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { Sidebar, SidebarHeader, SidebarTitle } from '../Sidebar'
import { InvitationForm, InvitationValues } from './InvitationForm'

const FormContainer = styled.div`
  padding: 20px;
`
const Container = styled.div`
  padding-top: 5px;
`

const StyledSidebar = styled(Sidebar)`
  background: white;
  border: 1px solid ${props => props.theme.colors.sidebar.background.selected};
  border-bottom: none;
  border-top: none;
`

interface Props {
  invitationValues: InvitationValues
  handleCancel: () => void
  handleSubmit: (values: InvitationValues) => Promise<void>
  invitationSent: boolean
}

const InviteCollaboratorsSidebar: React.FunctionComponent<Props> = ({
  invitationValues,
  handleCancel,
  handleSubmit,
  invitationSent,
}) => (
  <StyledSidebar>
    <SidebarHeader>
      <SidebarTitle>Invite</SidebarTitle>
      {!invitationSent ? (
        <Container>
          <GreyButton onClick={handleCancel}>Cancel</GreyButton>
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
      />
    </FormContainer>
  </StyledSidebar>
)

export default InviteCollaboratorsSidebar
