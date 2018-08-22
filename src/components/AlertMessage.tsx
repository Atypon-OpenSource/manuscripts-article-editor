import React from 'react'
import styled from 'styled-components'
import AttentionError from '../icons/attention-error'
import AttentionInfo from '../icons/attention-info'
import AttentionWarning from '../icons/attention-warning'
import CloseAlert from '../icons/close-alert'
import SuccessGreen from '../icons/success'

interface AlertProps {
  color: string
  backgroundColor: string
  borderColor: string
}

const CloseIcon = styled.div`
  display: flex;
  cursor: pointer;
  padding-right: 16px;
`

const InformativeIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 10px 0px 8px;
  width: 32px;
  height: 24px;
`

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 0px 13px;
`

const AlertContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 9px;
  color: ${(props: AlertProps) => props.color};
  background-color: ${(props: AlertProps) => props.backgroundColor};
  border: solid 1px ${(props: AlertProps) => props.borderColor};
  border-radius: 3px;
  align-items: center;
  justify-content: space-between;
`

interface State {
  isOpen: boolean
}

interface Props {
  type: string
}

class AlertMessage extends React.Component<Props, State> {
  public state: State = {
    isOpen: true,
  }

  public render() {
    const alertAttributes = this.getByType()

    return (
      this.state.isOpen && (
        <AlertContainer
          color={alertAttributes.color}
          backgroundColor={alertAttributes.backgroundColor}
          borderColor={alertAttributes.borderColor}
        >
          <InnerContainer>
            <InformativeIcon>{alertAttributes.icon}</InformativeIcon>
            {this.props.children}
          </InnerContainer>
          <CloseIcon onClick={this.handleClose}>
            {alertAttributes.closeButton}
          </CloseIcon>
        </AlertContainer>
      )
    )
  }

  private handleClose = () => {
    this.setState({ isOpen: false })
  }

  private getByType() {
    switch (this.props.type) {
      case 'success':
        return {
          icon: <SuccessGreen />,
          closeButton: <CloseAlert color={'#b2c0ac'} />,
          color: '#82ab80',
          backgroundColor: '#dff0d7',
          borderColor: '#b2c0ac',
        }
      case 'error':
        return {
          icon: <AttentionError />,
          closeButton: <CloseAlert color={'#f5c1b7'} />,
          backgroundColor: '#fff2f0',
          color: '#de6751',
          borderColor: '#f5c1b7',
        }
      case 'info':
        return {
          icon: <AttentionInfo />,
          closeButton: <CloseAlert color={'#adbec6'} />,
          backgroundColor: '#d8ecf7',
          color: '#417895',
          borderColor: '#7fb5d5',
        }
      default:
        return {
          icon: <AttentionWarning />,
          closeButton: <CloseAlert color={'#f7d7b2'} />,
          backgroundColor: '#fffcec',
          color: '#cc7836',
          borderColor: '#f7d7b2',
        }
    }
  }
}

export default AlertMessage
