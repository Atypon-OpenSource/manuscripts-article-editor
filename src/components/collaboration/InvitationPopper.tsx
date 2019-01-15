import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { isOwner } from '../../lib/roles'
import { styled, ThemedProps } from '../../theme'
import { GreyButton, PrimaryButton } from '../Button'
import { PopperBody } from '../Popper'
import { InvitationForm, InvitationValues } from './InvitationForm'

const LinkButton = styled(GreyButton)`
  width: 70px;
  text-transform: none;
`

const InviteButton = styled(PrimaryButton)`
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
  color: ${(props: ThemedDivProps) => props.theme.colors.popper.text.primary};
  display: inline-block;
  padding-right: 20px;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
`

interface Props {
  project: Project
  user: UserProfile
  handleInvitationSubmit: (values: InvitationValues) => Promise<void>
  handleSwitching: (page: boolean) => void
}

export const InvitationPopper: React.FunctionComponent<Props> = ({
  user,
  project,
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
      <InvitationForm
        allowSubmit={isProjectOwner}
        handleSubmit={handleInvitationSubmit}
      />
    </PopperBody>
  )
}
