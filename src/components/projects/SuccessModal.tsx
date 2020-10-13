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

import SuccessCircle from '@manuscripts/assets/react/SuccessCircle'
import {
  ButtonGroup,
  PrimaryButton,
  StyledModal,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { IndicatorKind, ProgressIndicator } from '../ProgressIndicator'

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
`

const ModalMain = styled.div`
  flex: 1;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 8}px;
  max-height: 70vh;
  overflow-y: auto;
  text-align: center;
  display: relative;
`

const ModalStatus = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 120%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalStatusText = styled.div`
  margin-left: 12px;
`

const ModalFooter = styled(ButtonGroup)`
  padding: ${(props) => props.theme.grid.unit * 4}px;
`

interface Props {
  status: string
  handleDone: () => void
}

export const SuccessModal: React.FunctionComponent<Props> = ({
  handleDone,
  status,
}) => (
  <StyledModal
    isOpen={true}
    onRequestClose={handleDone}
    shouldCloseOnOverlayClick={true}
  >
    <ModalBody>
      <ModalMain>
        <ProgressIndicator symbols={IndicatorKind.Project} />
        <ModalStatus>
          <SuccessCircle width={24} height={24} />
          <ModalStatusText>{status}</ModalStatusText>
        </ModalStatus>
      </ModalMain>
      <ModalFooter>
        <PrimaryButton onClick={handleDone}>Done</PrimaryButton>
      </ModalFooter>
    </ModalBody>
  </StyledModal>
)
