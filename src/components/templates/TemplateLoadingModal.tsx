/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import { CloseButton, StyledModal } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { IndicatorKind, ProgressIndicator } from '../ProgressIndicator'

const ModalBody = styled.div`
  border-radius: ${props => props.theme.grid.radius.default};
  box-shadow: ${props => props.theme.shadow.dropShadow};
  background: ${props => props.theme.colors.background.primary};
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 70vh;
  width: 70vw;
  max-width: 893px;
  min-width: 600px;
`

const ModalMain = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  text-align: center;
`

const ModalStatus = styled.div`
  align-items: center;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  font-size: 120%;
  justify-content: center;
`

const ModalHeader = styled.div`
  position: absolute;
  right: -${props => props.theme.grid.unit * 3}px;
  top: -${props => props.theme.grid.unit * 3}px;
  z-index: 1;
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
