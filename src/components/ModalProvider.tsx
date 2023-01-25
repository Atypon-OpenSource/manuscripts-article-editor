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

import { StyledModal } from '@manuscripts/style-guide'
import React from 'react'

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

interface State {
  modals: Array<{ id: string; modal: ModalComponent }>
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class ModalProvider extends React.Component<{}, State> {
  private readonly value: ModalProps

  // eslint-disable-next-line @typescript-eslint/ban-types
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
        .filter((item) => item.id !== id)
        .concat({ id, modal }),
    })
  }

  private closeModal = (id: string) => {
    this.setState({
      modals: this.state.modals.filter((modal) => modal.id !== id),
    })
  }

  private renderModal = () => {
    return this.state.modals.map(({ id, modal }) => {
      const handleClose = () => this.closeModal(id)

      return (
        <StyledModal key={id} isOpen={true} onRequestClose={handleClose}>
          {modal({ handleClose })}
        </StyledModal>
      )
    })
  }
}
