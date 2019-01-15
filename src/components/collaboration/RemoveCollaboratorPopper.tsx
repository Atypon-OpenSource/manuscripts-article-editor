import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import React from 'react'
import { darkGrey } from '../../colors'
import { initials } from '../../lib/name'
import { styled, ThemedProps } from '../../theme'
import { Avatar } from '../Avatar'
import { GreyButton } from '../Button'
import { PopperBody, SeparatorLine } from '../Popper'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const CollaboratorInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const CollaboratorName = styled.div`
  text-align: center;
  font-size: 120%;
  color: ${(props: ThemedDivProps) => props.theme.colors.popper.text.primary};
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
  color: ${(props: ThemedDivProps) => props.theme.colors.popper.text.primary};
  font-weight: 600;
  padding-left: 5px;
`

const Message = styled.div`
  display: flex;
  justify-content: center;
  color: ${(props: ThemedDivProps) => props.theme.colors.popper.text.primary};
  padding-bottom: 15px;
`

const Description = styled.div`
  display: flex;
  padding-bottom: 10px;
  font-size: 14px;
  color: ${(props: ThemedDivProps) => props.theme.colors.popper.text.secondary};
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
        <Avatar src={avatar} size={45} color={darkGrey} />
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
