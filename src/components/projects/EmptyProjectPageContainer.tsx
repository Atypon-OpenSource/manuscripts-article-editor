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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import { buildCollectionName } from '../../sync/Collection'
import { selectors } from '../../sync/syncEvents'
import { SyncStateContext } from '../../sync/SyncStore'
import { ModalProps, withModal } from '../ModalProvider'
import TemplateSelector from '../templates/TemplateSelector'
import { EmptyProjectPage } from './EmptyProjectPage'

interface Props {
  project: Project
  user: UserProfileWithAvatar
  message: string
  restartSync: () => void
}

class EmptyProjectPageContainer extends React.Component<Props & ModalProps> {
  public render() {
    const { project } = this.props
    return (
      <SyncStateContext.Consumer>
        {({ syncState }) => {
          const hasPullError = selectors.hasPullError(
            buildCollectionName(`project-${project._id}`),
            syncState
          )
          return (
            <EmptyProjectPage
              openTemplateSelector={this.openTemplateSelector}
              message={this.props.message}
              hasPullError={hasPullError}
              restartSync={this.props.restartSync}
            />
          )
        }}
      </SyncStateContext.Consumer>
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

export default withModal(EmptyProjectPageContainer)
