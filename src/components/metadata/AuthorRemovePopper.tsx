import { Contributor } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { initials } from '../../lib/name'
import { styled } from '../../theme/styled-components'
import { Avatar } from '../Avatar'
import { GreyButton } from '../Button'
import { CustomPopper, PopperBody, SeparatorLine } from '../Popper'

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

const AuthorRemovePopper: React.FunctionComponent<Props> = ({
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
          <Avatar size={45} />
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
          <GreyButton onClick={openPopper}>Cancel</GreyButton>
          <GreyButton onClick={removeAuthor}>Remove</GreyButton>
        </ButtonsContainer>
      </PopperBody>
    </CustomPopper>
  )
}

export default AuthorRemovePopper
