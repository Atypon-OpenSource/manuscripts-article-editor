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

import {
  ButtonGroup,
  PrimaryButton,
  StyledModal,
} from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { IndicatorKind, ProgressIndicator } from '../ProgressIndicator'

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 ${props => props.theme.colors.modal.shadow};
  background: #fff;
`

const ModalMain = styled.div`
  flex: 1;
  padding: 16px 32px;
  max-height: 70vh;
  overflow-y: auto;
  text-align: center;
  display: relative;
`

const ModalStatus = styled.div`
  color: #777;
  font-size: 120%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalFooter = styled(ButtonGroup)`
  padding: 16px;
`

interface Props {
  status: string
  canCancel: boolean
  handleCancel: () => void
}

export const ProgressModal: React.FunctionComponent<Props> = ({
  canCancel,
  handleCancel,
  status,
}) => (
  <StyledModal
    isOpen={true}
    onRequestClose={handleCancel}
    shouldCloseOnOverlayClick={false}
  >
    <ModalBody>
      <ModalMain>
        <ProgressIndicator symbols={IndicatorKind.Project} />
        <ModalStatus>{status}</ModalStatus>
      </ModalMain>
      <ModalFooter>
        <PrimaryButton onClick={handleCancel} disabled={!canCancel}>
          Cancel
        </PrimaryButton>
      </ModalFooter>
    </ModalBody>
  </StyledModal>
)
