import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import AttentionWarning from '../icons/attention-warning'
import { styled, ThemedProps } from '../theme'
import { ManuscriptBlueButton, TransparentGreyButton } from './Button'
import { StyledModal, totalTransitionTime } from './StyledModal'

const Container = styled.div`
  z-index: 10;
`

export const PopperBodyContainer = styled.div`
  width: auto;
  min-width: 150px;
  white-space: nowrap;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d6d6d6;
  border-radius: 5px;
  color: #444;
  padding: 4px 0;
  background: white;
  z-index: 10;

  &[data-placement='bottom-start'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &[data-placement='right-start'] {
    top: 10px;
  }
`

const Arrow = styled.div`
  position: relative;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #d6d6d6;
  top: 1px;
`

export const SeparatorLine = styled.div`
  margin: 10px 0 25px;
  background-color: #e6e6e6;
  height: 1px;
`

export const PopperBody = styled.div<{ size?: number }>`
  flex: 2;
  padding: 20px;
  max-width: ${props => props.size || 280}px;
`

interface Props {
  popperProps: PopperChildrenProps
}

export const CustomPopper: React.SFC<Props> = ({
  children,
  popperProps: { ref, style, placement, arrowProps },
}) => (
  <Container
    // @ts-ignore: styled
    ref={ref}
    style={style}
    data-placement={placement}
  >
    <Arrow
      // @ts-ignore: styled
      ref={arrowProps.ref}
      style={arrowProps.style}
    />
    <PopperBodyContainer>{children}</PopperBodyContainer>
  </Container>
)

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ButtonContainer = styled.div`
  margin-left: 4px;
`
const Icon = styled.div`
  margin-right: 6px;
  color: '#fffceb';
`
const ModalBody = styled.div`
  border-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 #d8d8d8;
  background: #fff;
`

const MessageContainer = styled.div`
  max-width: 297px;
  min-height: 95px;
  font-family: Barlow;
  font-size: 16px;
  color: #949494;
  margin-top: 15px;
  margin-left: 20px;
`
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: Barlow;
  font-size: 16px;
  font-weight: 500;
  padding-left: 20px;
  padding-top: 15px;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  padding-bottom: 20px;
`

interface DialogProps {
  isOpen: boolean
  primaryAction: () => void
  secondaryAction?: () => void
  secondaryActionTitle?: string
  primaryActionTitle?: string
  category: string
  header: string
  message: string
}

export enum Category {
  error = 'error',
  confirmation = 'confirmation',
}

export const Dialog: React.SFC<DialogProps> = ({
  isOpen,
  primaryAction,
  header,
  message,
  secondaryAction,
  secondaryActionTitle,
  primaryActionTitle,
  category,
}) => (
  <StyledModal
    isOpen={isOpen}
    onRequestClose={primaryAction}
    ariaHideApp={false}
    shouldCloseOnOverlayClick={true}
    closeTimeoutMS={totalTransitionTime}
  >
    <ModalBody>
      <HeaderContainer>
        {category === Category.error && (
          <Icon>
            <AttentionWarning />
          </Icon>
        )}
        {header}
      </HeaderContainer>
      <MessageContainer>{message}</MessageContainer>
      <ButtonsContainer>
        <ManuscriptBlueButton onClick={primaryAction}>
          {primaryActionTitle || 'Dismiss'}
        </ManuscriptBlueButton>
        {category === Category.confirmation && (
          <ButtonContainer>
            <TransparentGreyButton onClick={secondaryAction}>
              {secondaryActionTitle}
            </TransparentGreyButton>
          </ButtonContainer>
        )}
      </ButtonsContainer>
    </ModalBody>
  </StyledModal>
)
