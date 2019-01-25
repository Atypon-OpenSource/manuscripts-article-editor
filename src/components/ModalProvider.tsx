import React from 'react'
import { StyledModal, totalTransitionTime } from './StyledModal'

type ModalComponent = React.FunctionComponent<{
  handleClose: CloseModal
}>

type AddModal = (id: string, component: ModalComponent) => void
type CloseModal = () => void

export interface ModalProps {
  addModal: AddModal
}

export const ModalContext = React.createContext<ModalProps>({
  addModal: () => '',
})

export const withModal = <Props extends {}>(
  Component: React.ComponentType<ModalProps>
): React.ComponentType<Pick<Props, Exclude<keyof Props, ModalProps>>> => (
  props: Props
) => (
  <ModalContext.Consumer>
    {value => <Component {...props} {...value} />}
  </ModalContext.Consumer>
)

interface State {
  modals: Array<{ id: string; modal: ModalComponent }>
}

export class ModalProvider extends React.Component<{}, State> {
  private value: ModalProps

  public constructor(props: {}) {
    super(props)

    this.value = {
      addModal: this.addModal,
    }

    this.state = {
      modals: [],
    }
  }

  public render() {
    return (
      <ModalContext.Provider value={this.value}>
        {this.props.children}
        {this.renderModal()}
      </ModalContext.Provider>
    )
  }

  private addModal: AddModal = (id, modal) => {
    this.setState({
      modals: this.state.modals
        .filter(item => item.id !== id)
        .concat({ id, modal }),
    })
  }

  private closeModal = (id: string) => {
    this.setState({
      modals: this.state.modals.filter(modal => modal.id !== id),
    })
  }

  private renderModal = () => {
    const lastIndex = this.state.modals.length - 1

    return this.state.modals.map(({ id, modal }, index) => {
      const handleClose = () => this.closeModal(id)

      return (
        <StyledModal
          key={id}
          isOpen={index === lastIndex}
          onRequestClose={handleClose}
          closeTimeoutMS={totalTransitionTime}
        >
          {modal({ handleClose })}
        </StyledModal>
      )
    })
  }
}
