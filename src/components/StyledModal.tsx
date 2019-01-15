import React from 'react'
import Modal from 'react-modal'
import { styled, ThemedOuterProps } from '../theme'

Modal.setAppElement('#root')

export const totalTransitionTime = 800
const transitionDelay = 300
const delayedTransitionTime = totalTransitionTime - transitionDelay

interface Props {
  modalClassName?: Modal.Classes
}

export const ReactModalAdapter: React.FunctionComponent<
  Modal.Props & ThemedOuterProps<ReactModal> & Props
> = ({ className, modalClassName, ...props }) => (
  <Modal className={modalClassName} portalClassName={className} {...props} />
)

export const StyledModal = styled(ReactModalAdapter).attrs({
  overlayClassName: {
    base: 'Overlay',
    afterOpen: 'Overlay--after-open',
    beforeClose: 'Overlay--before-close',
  },
  modalClassName: {
    base: 'Modal',
    afterOpen: 'Modal--after-open',
    beforeClose: 'Modal--before-close',
  },
})`
  .Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.colors.modal.overlay};
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;

    &--after-open {
      transition: opacity ${totalTransitionTime}ms ease-in-out;
      opacity: 1;
    }

    &--before-close {
      transition: opacity ${delayedTransitionTime}ms ease-in-out;
      transition-delay: ${transitionDelay}ms;
      opacity: 0;
    }
  }

  .Modal {
    background: transparent;
    border: none;
    position: relative;
    top: -21px;
    outline: none;
    opacity: 0;
    transition: opacity ${delayedTransitionTime}ms ease-in-out,
      top ${delayedTransitionTime}ms ease-in-out;
    transition-delay: ${transitionDelay}ms;

    &--after-open {
      opacity: 1;
      top: -35px;
    }

    &--before-close {
      transition-delay: 0ms;
      opacity: 0;
      top: -21px;
    }
  }
`

// adapted from https://github.com/reactjs/react-modal/issues/603
