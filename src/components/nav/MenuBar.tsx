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
