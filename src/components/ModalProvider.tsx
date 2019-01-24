import React from 'react'
import { styled } from '../theme'

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

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  background: rgba(235, 235, 235, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
`

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
    return this.state.modals.map(({ id, modal }) => (
      <ModalContainer key={id}>
        {modal({
          handleClose: () => this.closeModal(id),
        })}
      </ModalContainer>
    ))
  }
}
