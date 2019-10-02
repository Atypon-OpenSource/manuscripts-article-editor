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

import { CloseButton } from '@manuscripts/style-guide'
import React from 'react'
import Modal from 'react-modal'
import { styled } from '../theme/styled-components'
import { theme } from '../theme/theme'

Modal.setAppElement('#root')

const ModalContainer = styled.div`
  margin: ${props => props.theme.grid.unit * 3}px;
  font-family: ${props => props.theme.font.family.sans};
  width: 480px;
  max-width: 70vw;

  @media (max-width: 450px) {
    width: 100%;
    max-width: unset;
  }
`

const ModalHeader = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
`

const ModalMain = styled.div`
  flex: 1;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadow.dropShadow};
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.grid.radius.default};
`

const ModalTitle = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  padding: ${props => props.theme.grid.unit * 4}px;
`

const ModalBody = styled.div`
  padding: ${props => props.theme.grid.unit * 4}px;
`

export const ModalFormActions = styled.div`
  margin-top: ${props => props.theme.grid.unit * 4}px;
  display: flex;
  justify-content: flex-end;
`

const ResponsiveModal = styled(Modal)`
  @media (max-width: 450px) {
    width: 90%;
  }
`

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.brand.light,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
  },
  content: {
    background: 'transparent',
    border: 'none',
    position: 'relative',
    top: '34%',
    left: 0,
    bottom: 0,
    right: 0,
    transform: 'translate(0, -50%)',
  },
}

interface Props {
  handleClose: () => void
  title: string | React.ReactNode
}

export const ModalForm: React.FunctionComponent<Props> = ({
  children,
  handleClose,
  title,
}) => (
  <ResponsiveModal
    isOpen={true}
    onRequestClose={handleClose}
    shouldCloseOnOverlayClick={true}
    style={modalStyle}
  >
    <ModalContainer>
      <ModalHeader>
        <CloseButton onClick={handleClose} />
      </ModalHeader>
      <ModalMain>
        <ModalTitle>{title}</ModalTitle>
        <ModalBody>{children}</ModalBody>
      </ModalMain>
    </ModalContainer>
  </ResponsiveModal>
)
