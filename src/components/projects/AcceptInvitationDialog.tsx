import React from 'react'
import { altoGrey, butteryYellow } from '../../colors'
import AttentionInfo from '../../icons/attention-info'
import { styled } from '../../theme'
import { PrimaryButton } from '../Button'
import { StyledModal, totalTransitionTime } from '../StyledModal'

const Icon = styled(AttentionInfo)`
  margin-right: 8px;
  color: ${butteryYellow};
`

const ModalBody = styled.div`
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 8px 0 ${altoGrey};
  background: #fff;
  font-family: ${props => props.theme.fontFamily};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  padding: 16px;
`

const Body = styled.div`
  width: 300px;
  height: 100px;
  font-size: 16px;
  color: ${props => props.theme.colors.dialog.text};
  padding: 0 16px;

  & a {
    color: inherit;
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;

  & button:not(:last-of-type) {
    margin-right: 4px;
  }
`

interface Props {
  message: string
  closeDialog: () => void
}

export const AcceptInvitationDialog: React.FunctionComponent<Props> = ({
  message,
  closeDialog,
}) => (
  <StyledModal
    isOpen={!!message}
    onRequestClose={closeDialog}
    shouldCloseOnOverlayClick={true}
    closeTimeoutMS={totalTransitionTime}
  >
    <ModalBody>
      <Header>
        <Icon /> Invitation accepted
      </Header>

      <Body>{message}</Body>

      <Actions>
        <PrimaryButton onClick={closeDialog}>Dismiss</PrimaryButton>
      </Actions>
    </ModalBody>
  </StyledModal>
)
