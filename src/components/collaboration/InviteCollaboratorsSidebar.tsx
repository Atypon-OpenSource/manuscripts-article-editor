import React from 'react'
import { styled } from '../../theme'
import { GreyButton, PrimaryButton } from '../Button'
import { Sidebar, SidebarHeader, SidebarTitle } from '../Sidebar'
import { InvitationForm, InvitationValues } from './InvitationForm'

const FormContainer = styled.div`
  padding: 20px;
`
const Container = styled.div`
  padding-top: 5px;
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
  <Sidebar>
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
  </Sidebar>
)

export default InviteCollaboratorsSidebar
