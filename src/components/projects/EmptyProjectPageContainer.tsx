import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { ModalProps, withModal } from '../ModalProvider'
import { TemplateSelector } from '../templates/TemplateSelector'
import { EmptyProjectPage } from './EmptyProjectPage'

interface Props {
  project: Project
  user: UserProfileWithAvatar
}

class EmptyProjectPageContainer extends React.Component<
  Props & ModalProps & RouteComponentProps<{ projectID: string }> & ModelsProps
> {
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
    const { addModal, history, match, models, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        handleComplete={handleClose}
        history={history}
        projectID={match.params.projectID}
        saveModel={models.saveModel}
        user={user}
      />
    ))
  }
}

export default withRouter<Props & RouteComponentProps<{ projectID: string }>>(
  withModal(withModels(EmptyProjectPageContainer))
)
