import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import React from 'react'
import Modal from 'react-modal'
import { styled } from '../theme/styled-components'

Modal.setAppElement('#root')

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fontFamily};
  width: 800px;
  max-width: 100%;
  margin: auto;
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
`

export const CloseButton = styled.button`
  width: 45px;
  height: 35px;
  display: inline-block;
  cursor: pointer;
  background: transparent;
  border: none;

  &:focus {
    outline: none;
  }
`

export const ModalMain = styled.div`
  flex: 1;
  flex-direction: column;
  border-radius: ${props => props.theme.radius}px;
  border: 1px solid ${props => props.theme.colors.modal.border};
  box-shadow: 0 10px 20px 0 rgba(107, 134, 164, 0.19);
  background: #fff;
`

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(217, 224, 243, 1)',
    opacity: 0.91,
  },
  content: {
    background: 'transparent',
    border: 'none',
    width: 800,
    maxWidth: '100%',
    padding: 0,
    margin: 'auto',
  },
}

interface Props {
  handleClose: () => void
}

export const SimpleModal: React.FunctionComponent<Props> = ({
  children,
  handleClose,
}) => (
  <Modal
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
      <ModalMain>{children}</ModalMain>
    </ModalContainer>
  </Modal>
)
