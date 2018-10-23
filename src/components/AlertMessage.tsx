import React from 'react'
import styled from 'styled-components'
import AttentionError from '../icons/attention-error'
import AttentionInfo from '../icons/attention-info'
import AttentionWarning from '../icons/attention-warning'
import CloseAlert from '../icons/close-alert'
import SuccessGreen from '../icons/success'

export const TextButton = styled.button`
  border: none;
  background: transparent;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1em;
  padding-right: 10px;
  padding-left: 0px;
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
  justify-content: space-between;
  white-space: normal;
  flex-shrink: 0;
`

const TextContainer = styled.div`
  padding-right: 10px;
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
    const alertAttributes = this.getByType()
    const { hideCloseButton, dismissButton, children } = this.props
    const { isOpen } = this.state

    return (
      isOpen && (
        <AlertContainer
          color={alertAttributes.color}
          backgroundColor={alertAttributes.backgroundColor}
          borderColor={alertAttributes.borderColor}
          className={'alert-message'}
        >
          <InnerContainer>
            <InformativeIcon>{alertAttributes.icon}</InformativeIcon>
            <TextContainer>
              {children}
              {dismissButton && (
                <TextButton
                  onClick={
                    dismissButton.action
                      ? dismissButton.action
                      : this.handleClose
                  }
                >
                  {dismissButton.text}
                </TextButton>
              )}
            </TextContainer>
          </InnerContainer>
          {!hideCloseButton && (
            <CloseIcon onClick={this.handleClose}>
              {alertAttributes.closeButton}
            </CloseIcon>
          )}
        </AlertContainer>
      )
    )
  }

  private handleClose = () => {
    this.setState({ isOpen: false })
  }

  private getByType() {
    switch (this.props.type) {
      case AlertMessageType.success:
        return {
          icon: <SuccessGreen />,
          closeButton: <CloseAlert color={'#b2c0ac'} />,
          color: '#3a773a',
          backgroundColor: '#dff0d7',
          borderColor: '#b2c0ac',
        }
      case AlertMessageType.error:
        return {
          icon: <AttentionError />,
          closeButton: <CloseAlert color={'#f5c1b7'} />,
          backgroundColor: '#fff1f0',
          color: '#dc5030',
          borderColor: '#f5c1b7',
        }
      case AlertMessageType.info:
        return {
          icon: <AttentionInfo />,
          closeButton: <CloseAlert color={'#adbec6'} />,
          backgroundColor: '#e0eef9',
          color: '#2a6f9d',
          borderColor: '#7fb5d5',
        }
      default:
        return {
          icon: <AttentionWarning />,
          closeButton: <CloseAlert color={'#f7d7b2'} />,
          backgroundColor: '#fffceb',
          color: '#e28327',
          borderColor: '#f7d7b2',
        }
    }
  }
}

export default AlertMessage
