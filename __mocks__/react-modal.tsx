import React from 'react'

interface ModalProps {
  isOpen?: boolean
}

const Modal: React.SFC<ModalProps> = ({ isOpen, children }) =>
  isOpen ? <div>{children}</div> : null

export default Modal
