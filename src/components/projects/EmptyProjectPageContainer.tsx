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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
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
    return <EmptyProjectPage openTemplateSelector={this.openTemplateSelector} />
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
