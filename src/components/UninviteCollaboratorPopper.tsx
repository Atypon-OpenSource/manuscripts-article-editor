import React from 'react'
import { darkGrey } from '../colors'
import { styled } from '../theme'
import { Avatar } from './Avatar'
import { TransparentBlackButton, TransparentGreyButton } from './Button'
import { PopperBody, SeparatorLine } from './Popper'

const CollaboratorName = styled.div`
  text-align: center;
  font-size: 120%;
  color: #353535;
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
  color: #353535;
  font-weight: 600;
  padding-left: 5px;
`
const Message = styled.div`
  display: flex;
  justify-content: center;
  color: #353535;
  padding-bottom: 15px;
`
const Description = styled.div`
  display: flex;
  padding-bottom: 10px;
  font-size: 14px;
  color: #949494;
  text-align: center;
  white-space: normal;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  handleUninvite: () => void
  invitedUserName: string
  switchMode: () => void
}

export const UninviteCollaboratorPopper: React.SFC<Props> = ({
  invitedUserName,
  handleUninvite,
  switchMode,
}) => (
  <PopperBody>
    <Message>
      Are you sure you want to <Action>uninvite</Action>
    </Message>
    <AvatarStyle>
      <Avatar size={45} color={darkGrey} />
    </AvatarStyle>
    <CollaboratorName>{invitedUserName}</CollaboratorName>
    <Message>from the Contributors list?</Message>
    <Description>
      {invitedUserName} won't get an invitation to view or modify any content of
      the project anymore
    </Description>
    <SeparatorLine />
    <ButtonsContainer>
      <TransparentBlackButton onClick={switchMode}>
        Cancel
      </TransparentBlackButton>
      <TransparentGreyButton onClick={handleUninvite}>
        Uninvite
      </TransparentGreyButton>
    </ButtonsContainer>
  </PopperBody>
)
