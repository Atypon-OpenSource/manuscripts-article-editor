import { Formik, FormikActions } from 'formik'
import React from 'react'
import { projectInvitationSchema } from '../validation'
import { Button, PrimaryButton } from './Button'
import {
  InvitationErrors,
  InvitationForm,
  InvitationValues,
} from './InvitationForm'
import {
  PopperBodyContainer,
  ShareProjectHeader,
  ShareProjectTitle,
} from './ShareProjectPopper'

export interface Props {
  handleInvitationSubmit: (
    values: InvitationValues,
    actions: FormikActions<InvitationValues | InvitationErrors>
  ) => void
  handleSwitching: (page: boolean) => void
}

export const InvitationPopper: React.SFC<Props> = ({
  handleInvitationSubmit,
  handleSwitching,
}) => (
  <PopperBodyContainer>
    <ShareProjectHeader>
      <ShareProjectTitle>Share Project</ShareProjectTitle>
      <Button onClick={() => handleSwitching(false)}>Link</Button>
      <PrimaryButton>Invite</PrimaryButton>
    </ShareProjectHeader>
    <Formik
      initialValues={{
        email: '',
        name: '',
        role: '',
      }}
      onSubmit={handleInvitationSubmit}
      isInitialValid={false}
      component={InvitationForm}
      validationSchema={projectInvitationSchema}
    />
  </PopperBodyContainer>
)
