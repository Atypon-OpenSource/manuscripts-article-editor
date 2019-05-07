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
import { PopperBody } from '../Popper'
import { CollaboratorRolesInput } from './CollaboratorRolesInput'

interface State {
  selectedRole: string
}

interface Props {
  addCollaborator: (role: string) => Promise<void>
}

class AddCollaboratorPopper extends React.Component<Props, State> {
  public state: State = {
    selectedRole: '',
  }

  public async componentWillUnmount() {
    const { selectedRole } = this.state

    if (selectedRole) {
      await this.props.addCollaborator(selectedRole)
    }
  }

  public render() {
    const { selectedRole } = this.state

    return (
      <PopperBody>
        <CollaboratorRolesInput
          name={'role'}
          value={selectedRole}
          onChange={this.handleRoleChange}
        />
      </PopperBody>
    )
  }
  private handleRoleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      selectedRole: event.currentTarget.value,
    })
  }
}

export default AddCollaboratorPopper
