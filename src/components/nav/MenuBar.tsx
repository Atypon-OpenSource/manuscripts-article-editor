/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import React from 'react'
import Modal from 'react-modal'

import { TokenActions } from '../../store'
import ProjectsSidebar from '../projects/ProjectsSidebar'
import { Menu, MenuBarIcon } from './Menu'

Modal.setAppElement('#root')

interface State {
  open: boolean
}

interface Props {
  tokenActions: TokenActions
}

class MenuBar extends React.Component<Props, State> {
  public state: Readonly<State> = {
    open: false,
  }

  public render() {
    const { children } = this.props

    return (
      <React.Fragment>
        <MenuBarIcon onClick={this.handleOpen}>{children}</MenuBarIcon>

        <Modal
          isOpen={this.state.open}
          onRequestClose={this.handleClose}
          style={{
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
              overflow: 'auto',
              border: 'none',
            },
          }}
        >
          <Menu handleClose={this.handleClose} />
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
