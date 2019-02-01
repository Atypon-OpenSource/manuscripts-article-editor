import AttentionRed from '@manuscripts/assets/react/AttentionRed'
import React from 'react'
import config from '../../config'
import { styled } from '../../theme/styled-components'
import { GreyButton, PrimaryButton } from '../Button'
import { StyledModal, totalTransitionTime } from '../StyledModal'

const Message: React.FunctionComponent<{
  message: string
}> = ({ message }) => (
  <div>
    <p>{message || 'Failed to open project for editing due to an error.'}</p>
    <p>
      If the problem persists, please contact{' '}
      <a href={`mailto:${config.support.email}`}>{config.support.email}</a>
    </p>
  </div>
)

const Icon = styled(AttentionRed)`
  margin-right: 8px;
  color: ${props => props.theme.colors.reload.icon};
`

const ModalBody = styled.div`
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 8px 0 ${props => props.theme.colors.modal.shadow};
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
  max-width: 300px;
  min-height: 100px;
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

const navigateToProjectsList = () => {
  window.location.href = '/projects'
}

const reloadPage = () => {
  // tslint:disable-next-line:deprecation
  window.location.reload(true)
}

interface Props {
  message: string
}

export const ReloadDialog: React.FunctionComponent<Props> = ({ message }) => (
  <StyledModal
    isOpen={true}
    onRequestClose={navigateToProjectsList}
    shouldCloseOnOverlayClick={true}
    closeTimeoutMS={totalTransitionTime}
  >
    <ModalBody>
      <Header>
        <Icon /> Failed to open project for editing
      </Header>

      <Body>
        <Message message={message} />
      </Body>

      <Actions>
        <GreyButton onClick={navigateToProjectsList}>View projects</GreyButton>

        <PrimaryButton onClick={reloadPage}>Retry</PrimaryButton>
      </Actions>
    </ModalBody>
  </StyledModal>
)
