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
import React, { useContext, useEffect, useState } from 'react'

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
export const ModalProvider: React.FC = ({ children }) => {
  const [modalsSetter, setModalsSetter] = useState<
    (id: string, modal: ModalComponent) => void
  >()

  const addModal: AddModal = (id, modal) => {
    modalsSetter && modalsSetter(id, modal)
  }

  const value: ModalProps = {
    addModal: addModal,
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalsContainer
        setModalsSetter={(modalSetter) => setModalsSetter(() => modalSetter)}
      />
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)

interface Props {
  setModalsSetter: (setter: (id: string, modal: ModalComponent) => void) => void
}

export const ModalsContainer: React.FC<Props> = ({ setModalsSetter }) => {
  const [state, setState] = useState<State>({
    modals: [],
  })

  useEffect(() => {
    setModalsSetter((id: string, modal: ModalComponent) => {
      const modals = state.modals
        .filter((item) => item.id !== id)
        .concat({ id, modal })
      setState({ ...state, modals })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeModal = (id: string) => {
    setState({
      modals: state.modals.filter((modal) => modal.id !== id),
    })
  }

  return (
    <>
      {state.modals.map(({ id, modal }) => {
        const handleClose = () => closeModal(id)

        return (
          <StyledModal key={id} isOpen={true} onRequestClose={handleClose}>
            {modal({ handleClose })}
          </StyledModal>
        )
      })}
    </>
  )
}
