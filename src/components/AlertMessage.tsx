/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AttentionBlue from '@manuscripts/assets/react/AttentionBlue'
import AttentionOrange from '@manuscripts/assets/react/AttentionOrange'
import AttentionRed from '@manuscripts/assets/react/AttentionRed'
import Closeblue from '@manuscripts/assets/react/Closeblue'
import Closegreen from '@manuscripts/assets/react/Closegreen'
import Closeorange from '@manuscripts/assets/react/Closeorange'
import Closered from '@manuscripts/assets/react/Closered'
import SuccessGreen from '@manuscripts/assets/react/SuccessGreen'
import React from 'react'
import { SizeMe } from 'react-sizeme'
import styled from 'styled-components'

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

const AlertContainer = styled.div<{
  type: string
}>`
  display: flex;
  color: ${props => props.theme.colors.alertMessage[props.type].text};
  background-color: ${props =>
    props.theme.colors.alertMessage[props.type].background};
  border: solid 1px
    ${props => props.theme.colors.alertMessage[props.type].border};
  border-radius: 3px;
  align-items: center;
  white-space: normal;
  flex-shrink: 0;
`

const TextContainer = styled.div`
  max-width: 700px;
  padding-right: 20px;
`

const SuccessIcon = styled(SuccessGreen)`
  transform: scale(0.75, 0.75);
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

const AlertIcon: React.FunctionComponent<{ type: AlertMessageType }> = ({
  type,
}) => {
  switch (type) {
    case AlertMessageType.success:
      return <SuccessIcon />
    case AlertMessageType.error:
      return <AttentionRed />
    case AlertMessageType.info:
      return <AttentionBlue />
    default:
      return <AttentionOrange />
  }
}

const AlertDismissButton: React.FunctionComponent<{
  type: AlertMessageType
}> = ({ type }) => {
  switch (type) {
    case AlertMessageType.success:
      return <Closegreen />
    case AlertMessageType.error:
      return <Closered />
    case AlertMessageType.info:
      return <Closeblue />
    default:
      return <Closeorange />
  }
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
            <AlertContainer type={type} className={'alert-message'}>
              <InnerContainer>
                <InformativeIcon>{<AlertIcon type={type} />}</InformativeIcon>
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
                      <AlertDismissButton type={type} />
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
}

export default AlertMessage
