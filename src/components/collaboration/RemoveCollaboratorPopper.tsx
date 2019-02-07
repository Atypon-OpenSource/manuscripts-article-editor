import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { GreyButton } from '@manuscripts/style-guide'
import React from 'react'
import { initials } from '../../lib/name'
import { styled } from '../../theme/styled-components'
import { Avatar } from '../Avatar'
import { PopperBody, SeparatorLine } from '../Popper'

const CollaboratorInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const CollaboratorName = styled.div`
  text-align: center;
  font-size: 120%;
  color: ${props => props.theme.colors.popper.text.primary};
  font-weight: 600;
  padding-bottom: 13px;
`

const AvatarStyle = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 14px;
  padding-bottom: 6px;
`

const Action = styled.div`
  color: ${props => props.theme.colors.popper.text.primary};
  font-weight: 600;
  padding-left: 5px;
`

const Message = styled.div`
  display: flex;
  justify-content: center;
  color: ${props => props.theme.colors.popper.text.primary};
  padding-bottom: 15px;
`

const Description = styled.div`
  display: flex;
  padding-bottom: 10px;
  font-size: 14px;
  color: ${props => props.theme.colors.popper.text.secondary};
  text-align: center;
  white-space: normal;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  collaborator: UserProfileWithAvatar
  handleRemove: () => void
  switchMode: () => void
}

export const RemoveCollaboratorPopper: React.FunctionComponent<Props> = ({
  collaborator,
  handleRemove,
  switchMode,
}) => {
  const { bibliographicName, avatar } = collaborator

  return (
    <PopperBody>
      <Message>
        Are you sure you want to <Action>remove</Action>
      </Message>
      <AvatarStyle>
        <Avatar src={avatar} size={45} />
      </AvatarStyle>
      <CollaboratorName>
        <CollaboratorInitial>{initials(bibliographicName)}</CollaboratorInitial>
        {bibliographicName.family}
      </CollaboratorName>
      <Message>from the Contributors list?</Message>
      <Description>
        {bibliographicName.given} won't be able to view or modify any content of
        the project anymore
      </Description>
      <SeparatorLine />
      <ButtonsContainer>
        <GreyButton onClick={switchMode}>Cancel</GreyButton>
        <GreyButton onClick={handleRemove}>Remove</GreyButton>
      </ButtonsContainer>
    </PopperBody>
  )
}
