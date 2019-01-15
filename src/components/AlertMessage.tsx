import React from 'react'
import { SizeMe } from 'react-sizeme'
import styled from 'styled-components'
import AttentionError from '../icons/attention-error'
import AttentionInfo from '../icons/attention-info'
import AttentionWarning from '../icons/attention-warning'
import CloseAlert from '../icons/close-alert'
import SuccessGreen from '../icons/success'
import { theme } from '../theme'

export const TextButton = styled.span`
  border: none;
  background: transparent;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1em;
  padding-right: 10px;
  padding-left: 0px;
  position: relative;
  top: 1px;
  white-space: nowrap;
`

const WideContainerButton = styled(TextButton)`
  padding-left: 10px;
`

const SmallContainerButton = styled(TextButton)`
  position: absolute;
  right: 10px;
  top: unset;
`

const CloseIcon = styled.div`
  display: flex;
  cursor: pointer;
  padding-right: 10px;
`

const InformativeIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 10px 0px 10px;
  width: 32px;
  height: 24px;
`

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 0px;
`

const CloseContainer = styled.div`
  position: absolute;
  right: 10px;
`

interface AlertProps {
  color: string
  backgroundColor: string
  borderColor: string
}

const AlertContainer = styled.div`
  display: flex;
  color: ${(props: AlertProps) => props.color};
  background-color: ${(props: AlertProps) => props.backgroundColor};
  border: solid 1px ${(props: AlertProps) => props.borderColor};
  border-radius: 3px;
  align-items: center;
  white-space: normal;
  flex-shrink: 0;
`

const TextContainer = styled.div`
  max-width: 700px;
  padding-right: 20px;
`

interface State {
  isOpen: boolean
}

interface Dismiss {
  text: string
  action?: () => void
}

export enum AlertMessageType {
  success = 'success',
  error = 'error',
  warning = 'warning',
  info = 'info',
}

interface Props {
  type: AlertMessageType
  dismissButton?: Dismiss
  hideCloseButton?: boolean
}

class AlertMessage extends React.Component<Props, State> {
  public state: State = {
    isOpen: true,
  }

  public render() {
    const { hideCloseButton, dismissButton, children, type } = this.props
    const { isOpen } = this.state

    return (
      isOpen && (
        <SizeMe>
          {({ size }) => (
            <AlertContainer
              color={theme.colors.alertMessage[type].text}
              backgroundColor={theme.colors.alertMessage[type].background}
              borderColor={theme.colors.alertMessage[type].border}
              className={'alert-message'}
            >
              <InnerContainer>
                <InformativeIcon>{this.getIcon()}</InformativeIcon>
                <TextContainer>
                  {children}
                  {dismissButton &&
                    (size.width! < 900 ? (
                      <SmallContainerButton
                        onClick={
                          dismissButton.action
                            ? dismissButton.action
                            : this.handleClose
                        }
                      >
                        {dismissButton.text}
                      </SmallContainerButton>
                    ) : (
                      <WideContainerButton
                        onClick={
                          dismissButton.action
                            ? dismissButton.action
                            : this.handleClose
                        }
                      >
                        {dismissButton.text}
                      </WideContainerButton>
                    ))}
                </TextContainer>
              </InnerContainer>
              {!hideCloseButton &&
                ((size.width! >= 900 || !dismissButton) && (
                  <CloseContainer>
                    <CloseIcon onClick={this.handleClose}>
                      <CloseAlert
                        color={theme.colors.alertMessage[type].dismiss}
                      />
                    </CloseIcon>
                  </CloseContainer>
                ))}
            </AlertContainer>
          )}
        </SizeMe>
      )
    )
  }

  private handleClose = () => {
    this.setState({ isOpen: false })
  }

  private getIcon() {
    switch (this.props.type) {
      case AlertMessageType.success:
        return <SuccessGreen />
      case AlertMessageType.error:
        return <AttentionError />

      case AlertMessageType.info:
        return <AttentionInfo />
      default:
        return <AttentionWarning />
    }
  }
}

export default AlertMessage
