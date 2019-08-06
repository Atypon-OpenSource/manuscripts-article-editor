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

import AttentionRed from '@manuscripts/assets/react/AttentionRed'
import {
  ButtonGroup,
  GreyButton,
  PrimaryButton,
  StyledModal,
} from '@manuscripts/style-guide'
import React from 'react'
import config from '../../config'
import { styled } from '../../theme/styled-components'

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

const Actions = styled(ButtonGroup)`
  padding: 16px;
`

const navigateToProjectsList = () => {
  window.location.href = '/projects'
}

const reloadPage = () => {
  window.location.reload()
}

interface Props {
  message: string
}

export const ReloadDialog: React.FunctionComponent<Props> = ({ message }) => (
  <StyledModal
    isOpen={true}
    onRequestClose={navigateToProjectsList}
    shouldCloseOnOverlayClick={true}
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
