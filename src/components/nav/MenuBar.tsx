import React from 'react'
import Modal from 'react-modal'
import ProjectsSidebar from '../projects/ProjectsSidebar'
import { Menu, MenuBarIcon } from './Menu'

Modal.setAppElement('#root')

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 20,
  },
  content: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden',
    border: 'none',
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
    const { children, projectID } = this.props

    return (
      <React.Fragment>
        <MenuBarIcon id="menu-bar-icon" onClick={this.handleOpen}>
          {children}
        </MenuBarIcon>

        <Modal
          isOpen={this.state.open}
          onRequestClose={this.handleClose}
          style={modalStyle}
        >
          <Menu handleClose={this.handleClose} projectID={projectID} />
          <ProjectsSidebar closeModal={this.handleClose} />
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
