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
import Modal from 'react-modal'
import { styled } from '../theme/styled-components'
import { theme } from '../theme/theme'

Modal.setAppElement('#root')

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fontFamily};
  width: 480px;
  max-width: 70vw;

  @media (max-width: 450px) {
    width: 100%;
    max-width: unset;
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
`

const ModalMain = styled.div`
  flex: 1;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 10px 20px 0 rgba(107, 134, 164, 0.19);
  background: #fff;
  border-radius: 8px;
`

const ModalTitle = styled.div`
  font-size: 24px;
  padding: 16px;
`

const ModalBody = styled.div`
  padding: 16px;
`

const CloseButton = styled.button`
  width: 45px;
  height: 35px;
  display: inline-block;
  cursor: pointer;
  background: transparent;
  border: none;
`

export const ModalFormActions = styled.div`
  margin-top: 16px;
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
    backgroundColor: theme.colors.modal.overlay,
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
        <CloseButton onClick={handleClose}>
          <CloseIconDark />
        </CloseButton>
      </ModalHeader>
      <ModalMain>
        <ModalTitle>{title}</ModalTitle>
        <ModalBody>{children}</ModalBody>
      </ModalMain>
    </ModalContainer>
  </ResponsiveModal>
)
