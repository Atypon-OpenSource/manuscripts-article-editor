import React from 'react'
import { initials } from '../lib/name'
import { styled } from '../theme'
import { UserProfile } from '../types/components'
import { Avatar } from './Avatar'
import { TransparentBlackButton, TransparentGreyButton } from './Button'
import { PopperBody, SeparatorLine } from './Popper'

const CollaboratorInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

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

const BoldText = styled.div`
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
  collaborator: UserProfile
  handleRemove: () => void
  switchMode: () => void
}

export const RemoveCollaboratorPopper: React.SFC<Props> = ({
  collaborator,
  handleRemove,
  switchMode,
}) => (
  <PopperBody>
    <Message>
      Are you sure you want to <BoldText>remove</BoldText>
    </Message>
    <AvatarStyle>
      <Avatar src={collaborator.avatar} size={45} color={'#585858'} />
    </AvatarStyle>
    <CollaboratorName>
      <CollaboratorInitial>
        {initials(collaborator.bibliographicName)}
      </CollaboratorInitial>
      {collaborator.bibliographicName.family}
    </CollaboratorName>
    <Message>from the Contributors list?</Message>
    <Description>
      {collaborator.bibliographicName.given} won't be able to view or modify any
      content of the project anymore
    </Description>
    <SeparatorLine />
    <ButtonsContainer>
      <TransparentBlackButton onClick={switchMode}>
        Cancel
      </TransparentBlackButton>
      <TransparentGreyButton onClick={handleRemove}>
        Remove
      </TransparentGreyButton>
    </ButtonsContainer>
  </PopperBody>
)
