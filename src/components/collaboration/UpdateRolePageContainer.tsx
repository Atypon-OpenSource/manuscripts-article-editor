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

import React from 'react'
import { Category, Dialog } from '../Dialog'

interface Props {
  selectedRole: string
  handleUpdateRole: (selectedRole: string) => void
  handleCancel: () => void
  updating: boolean
}

class UpdateRolePageContainer extends React.Component<Props> {
  public render() {
    const actions = {
      primary: {
        action: this.props.handleCancel,
        title: 'Cancel',
      },
      secondary: {
        action: this.handleUpdate,
        title: 'Update Role',
        isDestructive: true,
      },
    }
    return (
      <Dialog
        isOpen={this.props.updating}
        actions={actions}
        category={Category.confirmation}
        header={'Update collaborator role'}
        message={'Are you sure you want to update collaborator role?'}
      />
    )
  }

  private handleUpdate = () => {
    try {
      this.props.handleUpdateRole(this.props.selectedRole)
      this.props.handleCancel()
    } catch (error) {
      alert(error)
    }
  }
}

export default UpdateRolePageContainer
