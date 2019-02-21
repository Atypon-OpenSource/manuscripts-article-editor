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

import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { IndicatorKind, ProgressIndicator } from '../ProgressIndicator'
import { CloseButton } from '../SimpleModal'
import { StyledModal, totalTransitionTime } from '../StyledModal'

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 70vh;
  width: 70vw;
  max-width: 893px;
  min-width: 600px;
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 ${props => props.theme.colors.modal.shadow};
  background: ${props => props.theme.colors.modal.background};
`

const ModalMain = styled.div`
  flex: 1;
  overflow-y: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const ModalStatus = styled.div`
  color: #777;
  font-size: 120%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalHeader = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 8px;
`

interface Props {
  status: string
  handleCancel: () => void
}

export const TemplateLoadingModal: React.FunctionComponent<Props> = ({
  handleCancel,
  status,
}) => (
  <StyledModal
    isOpen={true}
    onRequestClose={handleCancel}
    shouldCloseOnOverlayClick={false}
    closeTimeoutMS={totalTransitionTime}
  >
    <ModalHeader>
      <CloseButton onClick={handleCancel}>
        <CloseIconDark />
      </CloseButton>
    </ModalHeader>
    <ModalBody>
      <ModalMain>
        <ProgressIndicator symbols={IndicatorKind.Project} />
        <ModalStatus>{status}</ModalStatus>
      </ModalMain>
    </ModalBody>
  </StyledModal>
)
