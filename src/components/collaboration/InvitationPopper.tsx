import { Formik, FormikActions, FormikProps } from 'formik'
import React from 'react'
import { manuscriptsGrey } from '../../colors'
import { isOwner } from '../../lib/roles'
import { styled, ThemedProps } from '../../theme'
import { Project, UserProfile } from '../../types/models'
import AlertMessage from '../AlertMessage'
import { ManuscriptBlueButton, TransparentGreyButton } from '../Button'
import { PopperBody } from '../Popper'
import {
  InvitationErrors,
  InvitationForm,
  InvitationValues,
} from './InvitationForm'

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
  invitationSent: boolean
  dismissSentAlert: () => void
  handleInvitationSubmit: (
    values: InvitationValues,
    actions: FormikActions<InvitationValues | InvitationErrors>
  ) => void
  handleSwitching: (page: boolean) => void
}

export const InvitationPopper: React.SFC<Props> = ({
  user,
  project,
  invitationSent,
  invitationError,
  dismissSentAlert,
  handleSwitching,
  handleInvitationSubmit,
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
      {!!invitationSent && (
        <AlertMessageContainer>
          <AlertMessage type={'success'} hideCloseButton={true}>
            Invitation was sent successfully.
          </AlertMessage>
        </AlertMessageContainer>
      )}
      <Formik
        initialValues={{
          email: '',
          name: '',
          role: 'Writer',
        }}
        onSubmit={handleInvitationSubmit}
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        render={(props: FormikProps<InvitationValues & InvitationErrors>) => (
          <InvitationForm
            {...props}
            dismissSentAlert={dismissSentAlert}
            disabled={!isProjectOwner}
          />
        )}
      />
    </PopperBody>
  )
}
