import { Contributor } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { darkGrey } from '../../colors'
import { initials } from '../../lib/name'
import { styled, ThemedProps } from '../../theme'
import { Avatar } from '../Avatar'
import { GreyButton } from '../Button'
import { CustomPopper, PopperBody, SeparatorLine } from '../Popper'

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
          <GreyButton onClick={openPopper}>Cancel</GreyButton>
          <GreyButton onClick={removeAuthor}>Remove</GreyButton>
        </ButtonsContainer>
      </PopperBody>
    </CustomPopper>
  )
}

export default AuthorRemovePopper
