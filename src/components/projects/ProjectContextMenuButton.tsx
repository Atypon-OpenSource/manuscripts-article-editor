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

import HorizontalEllipsis from '@manuscripts/assets/react/HorizontalEllipsis'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog, IconButton } from '@manuscripts/style-guide'
import { parse as parseTitle } from '@manuscripts/title-editor'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { styled } from '../../theme/styled-components'
import { ModalProps, withModal } from '../ModalProvider'
import { Dropdown, DropdownContainer } from '../nav/Dropdown'
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
  isConfirmDeleteOpen: boolean
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
    isConfirmDeleteOpen: false,
    isRenameOpen: false,
  }

  private nodeRef: React.RefObject<HTMLDivElement> = React.createRef()

  public componentWillUnmount() {
    this.setOpen(false)
  }

  public render() {
    const { isOpen, isConfirmDeleteOpen, isRenameOpen } = this.state
    const { closeModal, deleteProject, history, project } = this.props

    const actions = {
      primary: {
        action: () =>
          this.setState({
            isConfirmDeleteOpen: false,
          }),
        title: 'Cancel',
      },
      secondary: {
        action: async () => {
          await deleteProject()
          // TODO: delete project models and collection
          history.push('/projects')
        },
        title: 'Delete',
        isDestructive: true,
      },
    }

    const confirmDeleteProjectMessage = (title: string) => {
      const node = parseTitle(title)
      return `Are you sure you wish to delete the project with title "${node.textContent}"?`
    }

    const message = this.props.project.title
      ? confirmDeleteProjectMessage(this.props.project.title)
      : 'Are you sure you wish to delete this untitled project?'

    return (
      <DropdownContainer
        ref={this.nodeRef}
        onClick={event => event.stopPropagation()}
      >
        <ContextMenuIconButton onClick={this.toggleOpen}>
          <HorizontalEllipsis />
        </ContextMenuIconButton>
        {isOpen && (
          <Dropdown>
            <ProjectContextMenu
              project={project}
              deleteProject={this.deleteProject}
              renameProject={this.renameProject}
              closeModal={closeModal}
            />
          </Dropdown>
        )}
        {isConfirmDeleteOpen && (
          <Dialog
            isOpen={isConfirmDeleteOpen}
            actions={actions}
            category={Category.confirmation}
            header={'Delete Project'}
            message={message}
          />
        )}
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

  private deleteProject = () =>
    this.setState({
      isConfirmDeleteOpen: true,
    })

  private renameProject = () =>
    this.setState({
      isRenameOpen: true,
    })
}

export default withModal<Props>(withRouter(ProjectContextMenuButton))
