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

import HorizontalEllipsis from '@manuscripts/assets/react/HorizontalEllipsis'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { IconButton } from '@manuscripts/style-guide'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { ModalProps, withModal } from '../ModalProvider'
import { Dropdown, DropdownContainer } from '../nav/Dropdown'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'
import ProjectContextMenu from './ProjectContextMenu'
import RenameProject from './RenameProject'

const ContextMenuIconButton = styled(IconButton)`
  height: unset;
  width: unset;

  &:focus {
    outline: none;
  }
`

interface State {
  isOpen: boolean
  isRenameOpen: boolean
}

interface Props {
  deleteProject: () => Promise<string>
  project: Project
  saveProjectTitle: (title: string) => Promise<Project>
  closeModal?: () => void
}

type CombinedProps = Props & ModalProps & RouteComponentProps

class ProjectContextMenuButton extends React.Component<CombinedProps, State> {
  public state: State = {
    isOpen: false,
    isRenameOpen: false,
  }

  private nodeRef: React.RefObject<HTMLDivElement> = React.createRef()

  public componentWillUnmount() {
    this.setOpen(false)
  }

  public render() {
    const { isOpen, isRenameOpen } = this.state
    const { closeModal, project } = this.props

    return (
      <DropdownContainer
        ref={this.nodeRef}
        onClick={(event) => event.stopPropagation()}
      >
        <ContextMenuIconButton onClick={this.toggleOpen}>
          <HorizontalEllipsis />
        </ContextMenuIconButton>
        <DeleteConfirmationDialog handleDelete={this.deleteProject}>
          {({ handleRequestDelete }) =>
            isOpen ? (
              <Dropdown direction={'right'} top={24}>
                <ProjectContextMenu
                  project={project}
                  deleteProject={handleRequestDelete}
                  renameProject={this.renameProject}
                  closeModal={closeModal}
                />
              </Dropdown>
            ) : null
          }
        </DeleteConfirmationDialog>
        {isRenameOpen &&
          this.props.addModal('rename-project', ({ handleClose }) => (
            <RenameProject
              project={this.props.project}
              saveProjectTitle={this.props.saveProjectTitle}
              handleComplete={() => {
                handleClose()
                this.setState({
                  isRenameOpen: false,
                })
              }}
            />
          ))}
      </DropdownContainer>
    )
  }

  private toggleOpen = () => {
    this.setOpen(!this.state.isOpen)
  }

  private setOpen = (isOpen: boolean) => {
    this.setState({ isOpen })
    this.updateListener(isOpen)
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (
      this.nodeRef.current &&
      !this.nodeRef.current.contains(event.target as Node)
    ) {
      this.setOpen(false)
    }
  }

  private updateListener = (isOpen: boolean) => {
    if (isOpen) {
      document.addEventListener('mousedown', this.handleClickOutside)
    } else {
      document.removeEventListener('mousedown', this.handleClickOutside)
    }
  }

  private deleteProject = async () => {
    await this.props.deleteProject()
    // TODO: delete project models and collection
    this.props.history.push('/projects')
  }

  private renameProject = () =>
    this.setState({
      isRenameOpen: true,
    })
}

export default withModal(withRouter(ProjectContextMenuButton))
