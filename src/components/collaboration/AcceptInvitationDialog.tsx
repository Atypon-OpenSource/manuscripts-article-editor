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
import { PrimaryButton, StyledModal } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'

const Icon = styled(AttentionBlue)`
  margin-right: 8px;
  color: ${props => props.theme.colors.acceptInvitation.icon};
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
