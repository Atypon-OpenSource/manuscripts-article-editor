import { Formik, FormikActions } from 'formik'
import React from 'react'
import { manuscriptsGrey } from '../colors'
import { isOwner } from '../lib/roles'
import { styled, ThemedProps } from '../theme'
import { Project, UserProfile } from '../types/components'
import AlertMessage from './AlertMessage'
import { ManuscriptBlueButton, TransparentGreyButton } from './Button'
import {
  InvitationErrors,
  InvitationForm,
  InvitationValues,
} from './InvitationForm'
import { PopperBody } from './Popper'

const AlertMessageContainer = styled.div`
  margin-bottom: 9px;
`

const LinkButton = styled(TransparentGreyButton)`
  width: 70px;
  text-transform: none;
`

const InviteButton = styled(ManuscriptBlueButton)`
  width: 70px;
  text-transform: none;
`

export const ShareProjectHeader = styled.div`
  display: flex;
  padding-bottom: 29px;
  justify-content: space-between;
`

type ThemedDivProps = ThemedProps<HTMLDivElement>

export const ShareProjectTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.9px;
  color: ${manuscriptsGrey};
  display: inline-block;
  padding-right: 20px;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
`

interface Props {
  project: Project
  user: UserProfile
  invitationError: Error | null
  handleInvitationSubmit: (
    values: InvitationValues,
    actions: FormikActions<InvitationValues | InvitationErrors>
  ) => void
  handleSwitching: (page: boolean) => void
}

export const InvitationPopper: React.SFC<Props> = ({
  handleInvitationSubmit,
  handleSwitching,
  invitationError,
  project,
  user,
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
      {!isProjectOwner &&
        !invitationError && (
          <AlertMessageContainer>
            <AlertMessage type={'error'} hideCloseButton={true}>
              Only project owners can invite others to the project.
            </AlertMessage>
          </AlertMessageContainer>
        )}
      {!!invitationError && (
        <AlertMessageContainer>
          <AlertMessage type={'error'} hideCloseButton={true}>
            Sending invitation failed.
          </AlertMessage>
        </AlertMessageContainer>
      )}
      <Formik
        initialValues={{
          email: '',
          name: '',
          role: 'Writer',
          disabled: !isProjectOwner,
        }}
        onSubmit={handleInvitationSubmit}
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        component={InvitationForm}
      />
    </PopperBody>
  )
}
