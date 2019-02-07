import AttentionRed from '@manuscripts/assets/react/AttentionRed'
import { GreyButton, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../theme/styled-components'
import { StyledModal, totalTransitionTime } from './StyledModal'

const ButtonContainer = styled.div`
  margin-left: 4px;
`
const Container = styled.div`
  display: flex;
  margin-top: 20px;
`
const Icon = styled.div`
  margin-right: 6px;
  color: ${props => props.theme.colors.dialog.icon};
`
const ModalBody = styled.div`
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 ${props => props.theme.colors.dialog.shadow};
  background: ${props => props.theme.colors.dialog.background};
  min-width: 200px;
`

const MessageContainer = styled.div`
  max-width: 297px;
  min-height: 95px;
  font-family: Barlow;
  font-size: 16px;
  color: ${props => props.theme.colors.dialog.text};
  margin-top: 15px;
  margin-left: 20px;
  margin-right: 20px;
`
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: Barlow;
  font-size: 16px;
  font-weight: 500;
  padding: 15px 20px 0;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  padding-bottom: 20px;
`

interface DialogProps {
  isOpen: boolean
  actions: {
    primary: {
      action: () => void
      title?: string
    }
    secondary?: {
      action: () => void
      title: string
      isDestructive: boolean
    }
  }
  category: Category
  header: string
  message: string | React.ReactElement<{}>
}

export enum Category {
  error = 'error',
  confirmation = 'confirmation',
}

export const Dialog: React.FunctionComponent<DialogProps> = ({
  isOpen,
  actions,
  header,
  message,
  category,
}) => (
  <StyledModal
    isOpen={isOpen}
    onRequestClose={actions.primary.action}
    shouldCloseOnOverlayClick={true}
    closeTimeoutMS={totalTransitionTime}
  >
    <ModalBody>
      <HeaderContainer>
        {category === Category.error && (
          <Icon>
            <AttentionRed />
          </Icon>
        )}
        {header}
      </HeaderContainer>
      <MessageContainer>{message}</MessageContainer>
      <ButtonsContainer>
        {category === Category.confirmation && actions.secondary ? (
          !actions.secondary.isDestructive ? (
            <Container>
              <GreyButton onClick={actions.primary.action}>
                {actions.primary.title || 'Dismiss'}
              </GreyButton>
              <ButtonContainer>
                <PrimaryButton onClick={actions.secondary.action}>
                  {actions.secondary.title}
                </PrimaryButton>
              </ButtonContainer>
            </Container>
          ) : (
            <Container>
              <GreyButton onClick={actions.secondary.action}>
                {actions.secondary.title}
              </GreyButton>
              <ButtonContainer>
                <PrimaryButton onClick={actions.primary.action}>
                  {actions.primary.title || 'Dismiss'}
                </PrimaryButton>
              </ButtonContainer>
            </Container>
          )
        ) : (
          <PrimaryButton onClick={actions.primary.action}>
            {actions.primary.title || 'Dismiss'}
          </PrimaryButton>
        )}
      </ButtonsContainer>
    </ModalBody>
  </StyledModal>
)
