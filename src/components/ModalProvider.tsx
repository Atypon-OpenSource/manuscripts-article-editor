import React from 'react'
import uuid from 'uuid/v4'
import { styled } from '../theme'

type ModalComponent = React.FunctionComponent<{
  handleClose: CloseModal
}>

type AddModal = (component: ModalComponent) => string
type CloseModal = (id: string) => void

export interface ModalProps {
  addModal: AddModal
  closeModal: CloseModal
}

export const ModalContext = React.createContext<ModalProps>({
  addModal: () => '',
  closeModal: id => null,
})

export const withModal = (
  Component: React.ComponentType<ModalProps>
): React.ComponentType<ModalProps> => (props: object) => (
  <ModalContext.Consumer>
    {value => <Component {...props} {...value} />}
  </ModalContext.Consumer>
)

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background: #eee;
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface State {
  modals: Array<{ id: string; modal: ModalComponent }>
  value: ModalProps
}

export class ModalProvider extends React.Component<{}, State> {
  public constructor(props: {}) {
    super(props)

    this.state = {
      modals: [],
      value: {
        addModal: this.addModal,
        closeModal: this.closeModal,
      },
    }
  }

  public render() {
    return (
      <ModalContext.Provider value={this.state.value}>
        {this.props.children}
        {this.renderModal()}
      </ModalContext.Provider>
    )
  }

  private addModal: AddModal = modal => {
    const id = uuid()

    this.setState({
      modals: this.state.modals.concat({ id, modal }),
    })

    return id
  }

  private closeModal: CloseModal = id => {
    this.setState({
      modals: this.state.modals.filter(modal => modal.id !== id),
    })
  }

  private renderModal = () => {
    const { modals } = this.state

    if (!modals.length) {
      return null
    }

    const { id, modal } = modals[modals.length - 1]

    const Modal = modal

    return (
      <ModalContainer>
        <Modal handleClose={() => this.closeModal(id)} />
      </ModalContainer>
    )
  }
}
