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
): React.ComponentType<Props> => (props: Props) => (
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
  value: ModalProps
}

export class ModalProvider extends React.Component<{}, State> {
  public constructor(props: {}) {
    super(props)

    this.state = {
      modals: [],
      value: {
        addModal: this.addModal,
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
    const { modals } = this.state

    if (!modals.length) {
      return null
    }

    const { id, modal } = modals[modals.length - 1]

    return (
      <ModalContainer>
        {modal({
          handleClose: () => this.closeModal(id),
        })}
      </ModalContainer>
    )
  }
}
