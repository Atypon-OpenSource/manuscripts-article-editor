import { Project } from '@manuscripts/manuscripts-json-schema/dist/types'
import { parse as parseTitle } from '@manuscripts/title-editor'
import React from 'react'
import UserData from '../../data/UserData'
import { getCurrentUserId } from '../../lib/user'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { Category, Dialog } from '../Dialog'
import { ModalProps, withModal } from '../ModalProvider'
import ProjectContextMenuList from './ProjectContextMenuList'
import RenameProject from './RenameProject'

interface Props {
  project: Project
}

interface State {
  isRenameOpen: boolean
  isConfirmDeleteOpen: boolean
}

class ProjectContextMenu extends React.Component<
  Props & ModelsProps & ModalProps,
  State
> {
  public state: Readonly<State> = {
    isRenameOpen: false,
    isConfirmDeleteOpen: false,
  }

  public render() {
    const { project } = this.props
    const { isConfirmDeleteOpen, isRenameOpen } = this.state

    const actions = {
      primary: {
        action: () =>
          this.setState({
            isConfirmDeleteOpen: false,
          }),
        title: 'Cancel',
      },
      secondary: {
        action: () => this.props.models.deleteModel(this.props.project._id),
        title: 'Delete',
        isDestructive: true,
      },
    }

    const confirmDeleteProjectMessage = (title: string) => {
      const node = parseTitle(title)
      return `Are you sure you wish to delete the project with title "${
        node.textContent
      }"?`
    }

    const message = this.props.project.title
      ? confirmDeleteProjectMessage(this.props.project.title)
      : 'Are you sure you wish to delete this untitled project?'

    return (
      <UserData userID={getCurrentUserId()!}>
        {user => (
          <React.Fragment>
            <ProjectContextMenuList
              project={project}
              user={user}
              renameProject={this.renameProject}
              deleteProject={this.deleteProject}
            />
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
                  handleComplete={() => {
                    handleClose()
                    this.setState({
                      isRenameOpen: false,
                    })
                  }}
                />
              ))}
          </React.Fragment>
        )}
      </UserData>
    )
  }

  private renameProject = () => this.setState({ isRenameOpen: true })

  private deleteProject = () =>
    this.setState({
      isConfirmDeleteOpen: true,
    })
}

export default withModal<Props>(withModels(ProjectContextMenu))
