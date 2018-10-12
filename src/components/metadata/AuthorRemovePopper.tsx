import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { darkGrey } from '../../colors'
import { initials } from '../../lib/name'
import { styled } from '../../theme'
import { Contributor } from '../../types/components'
import { Avatar } from '../Avatar'
import { TransparentBlackButton, TransparentGreyButton } from '../Button'
import { CustomPopper, PopperBody, SeparatorLine } from '../Popper'

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

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  author: Contributor
  popperProps: PopperChildrenProps
  removeAuthor: () => void
  openPopper: () => void
}

const AuthorRemovePopper: React.SFC<Props> = ({
  removeAuthor,
  author,
  popperProps,
  openPopper,
}) => {
  const { bibliographicName } = author
  return (
    <CustomPopper popperProps={popperProps}>
      <PopperBody>
        <Message>
          Are you sure you want to <Action>remove</Action>
        </Message>
        <AvatarStyle>
          <Avatar size={45} color={darkGrey} />
        </AvatarStyle>
        <CollaboratorName>
          <CollaboratorInitial>
            {initials(bibliographicName)}
          </CollaboratorInitial>
          {bibliographicName.family}
        </CollaboratorName>
        <Message>from the Authors list?</Message>
        <SeparatorLine />
        <ButtonsContainer>
          <TransparentBlackButton onClick={openPopper}>
            Cancel
          </TransparentBlackButton>
          <TransparentGreyButton onClick={removeAuthor}>
            Remove
          </TransparentGreyButton>
        </ButtonsContainer>
      </PopperBody>
    </CustomPopper>
  )
}

export default AuthorRemovePopper
