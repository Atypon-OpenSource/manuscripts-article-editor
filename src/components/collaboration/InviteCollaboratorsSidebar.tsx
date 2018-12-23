import React from 'react'
import Panel from '../../components/Panel'
import { styled } from '../../theme'
import { ManuscriptBlueButton, TransparentGreyButton } from '../Button'
import { Sidebar, SidebarHeader, SidebarTitle } from '../Sidebar'
import { InvitationForm, InvitationValues } from './InvitationForm'

const CollaboratorSidebar = styled(Sidebar)`
  background-color: #f8fbfe;
`

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
  <Panel
    name={'collaborators-sidebar'}
    direction={'row'}
    side={'end'}
    minSize={250}
  >
    <CollaboratorSidebar>
      <SidebarHeader>
        <SidebarTitle>Invite</SidebarTitle>
        {!invitationSent ? (
          <Container>
            <TransparentGreyButton onClick={handleCancel}>
              Cancel
            </TransparentGreyButton>
          </Container>
        ) : (
          <ManuscriptBlueButton onClick={handleCancel}>
            Done
          </ManuscriptBlueButton>
        )}
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
