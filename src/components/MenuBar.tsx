import React from 'react'
import Modal from 'react-modal'
import Hamburger from '../icons/hamburger'
import { Menu, MenuBarIcon } from './Menu'

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 20,
  },
  content: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 'auto',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    height: 58,
    padding: 0,
    overflow: 'visible',
    border: 'none',
    borderBottom: 'solid 1px rgba(151, 151, 151, 0.26)',
  },
}

interface State {
  open: boolean
}

interface Props {
  projectID: string
}

class MenuBar extends React.Component<Props, State> {
  public state: Readonly<State> = {
    open: false,
  }

  public render() {
    const { projectID } = this.props

    return (
      <React.Fragment>
        <MenuBarIcon onClick={this.handleOpen} id="menuBarIcon">
          <Hamburger size={24} />
        </MenuBarIcon>

        <Modal
          isOpen={this.state.open}
          onRequestClose={this.handleClose}
          style={modalStyle}
          ariaHideApp={false}
        >
          <Menu handleClose={this.handleClose} projectID={projectID} />
        </Modal>
      </React.Fragment>
    )
  }

  private handleClose = () => {
    this.setState({ open: false })
  }

  private handleOpen = () => {
    this.setState({ open: true })
  }
}

export default MenuBar
