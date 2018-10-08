import { Formik, FormikActions } from 'formik'
import React from 'react'
import { manuscriptsGrey } from '../colors'
import AttentionError from '../icons/attention-error'
import { getUserRole, ProjectRole } from '../lib/roles'
import { styled, ThemedProps } from '../theme'
import { Project, UserProfile } from '../types/components'
import { ManuscriptBlueButton, TransparentGreyButton } from './Button'
import {
  InvitationErrors,
  InvitationForm,
  InvitationValues,
} from './InvitationForm'
import { PopperBody } from './Popper'

const ErrorMessage = styled.div`
  display: flex;
  padding: 8px 25px;
  margin-bottom: 21px;
  border-radius: 6px;
  background-color: #fff1f0;
  border: solid 1px #f5c1b7;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.34;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #dc5030;
  white-space: normal;
`

const MessageText = styled.div`
  display: flex;
  align-items: center;
  margin-left: 8px;
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
  handleInvitationSubmit: (
    values: InvitationValues,
    actions: FormikActions<InvitationValues | InvitationErrors>
  ) => void
  handleSwitching: (page: boolean) => void
}

export const InvitationPopper: React.SFC<Props> = ({
  handleInvitationSubmit,
  handleSwitching,
  project,
  user,
}) => {
  const isOwner = getUserRole(project, user.userID) === ProjectRole.owner

  return (
    <PopperBody>
      <ShareProjectHeader>
        <ShareProjectTitle>Share Project</ShareProjectTitle>
        <div>
          <LinkButton onClick={() => handleSwitching(false)}>Link</LinkButton>
          <InviteButton>Invite</InviteButton>
        </div>
      </ShareProjectHeader>
      {!isOwner && (
        <ErrorMessage>
          <AttentionError />
          <MessageText>
            Only project owners can share links to the document.
          </MessageText>
        </ErrorMessage>
      )}
      <Formik
        initialValues={{
          email: isOwner ? true : false,
          name: isOwner ? true : false,
          role: isOwner ? true : false,
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
