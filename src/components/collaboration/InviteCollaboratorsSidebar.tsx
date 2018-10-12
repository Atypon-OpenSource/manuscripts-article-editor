import { Formik, FormikActions } from 'formik'
import React from 'react'
import Panel from '../../components/Panel'
import { styled } from '../../theme'
import { projectInvitationSchema } from '../../validation'
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
  handleCancel: () => void
  initialValues: InvitationValues
  onSubmit: (
    values: InvitationValues,
    formikActions: FormikActions<InvitationValues>
  ) => void
}

const InviteCollaboratorsSidebar: React.SFC<Props> = ({
  handleCancel,
  initialValues,
  onSubmit,
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
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          isInitialValid={true}
          validateOnChange={false}
          validateOnBlur={false}
          component={InvitationForm}
          validationSchema={projectInvitationSchema}
        />
      </FormContainer>
    </CollaboratorSidebar>
  </Panel>
)

export default InviteCollaboratorsSidebar
