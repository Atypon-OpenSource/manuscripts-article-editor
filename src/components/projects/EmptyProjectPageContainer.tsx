import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { ModalProps, withModal } from '../ModalProvider'
import TemplateSelector from '../templates/TemplateSelector'
import { EmptyProjectPage } from './EmptyProjectPage'

interface Props {
  project: Project
  user: UserProfileWithAvatar
}

class EmptyProjectPageContainer extends React.Component<Props & ModalProps> {
  public render() {
    const { project } = this.props

    return (
      <EmptyProjectPage
        project={project}
        openTemplateSelector={this.openTemplateSelector}
      />
    )
  }

  private openTemplateSelector = () => {
    const { addModal, project, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        handleComplete={handleClose}
        projectID={project._id}
        user={user}
      />
    ))
  }
}

export default withModal<Props>(EmptyProjectPageContainer)
