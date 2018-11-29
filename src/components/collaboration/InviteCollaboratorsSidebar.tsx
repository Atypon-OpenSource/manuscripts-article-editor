import React from 'react'
import Panel from '../../components/Panel'
import { styled } from '../../theme'
import { TransparentGreyButton } from '../Button'
import { Sidebar, SidebarHeader, SidebarTitle } from '../Sidebar'
import { InvitationForm, InvitationValues } from './InvitationForm'

const CollaboratorSidebar = styled(Sidebar)`
  background-color: #f8fbfe;
`

const FormContainer = styled.div`
  padding: 20px;
`

interface Props {
  invitationValues: InvitationValues
  handleCancel: () => void
  handleSubmit: (values: InvitationValues) => Promise<void>
}

const InviteCollaboratorsSidebar: React.FunctionComponent<Props> = ({
  invitationValues,
  handleCancel,
  handleSubmit,
}) => (
  <Panel
    name={'collaborators-sidebar'}
    direction={'row'}
    side={'end'}
    minSize={250}
  >
    <CollaboratorSidebar>
      <SidebarHeader>
        <SidebarTitle>Invite</SidebarTitle>
        <TransparentGreyButton onClick={handleCancel}>
          Cancel
        </TransparentGreyButton>
      </SidebarHeader>
      <FormContainer>
        <InvitationForm
          allowSubmit={true}
          invitationValues={invitationValues}
          handleSubmit={handleSubmit}
        />
      </FormContainer>
    </CollaboratorSidebar>
  </Panel>
)

export default InviteCollaboratorsSidebar
