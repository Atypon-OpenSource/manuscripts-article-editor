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
import { PopperChildrenProps } from 'react-popper'
import { CustomPopper } from '../Popper'
import AddCollaboratorPopper from './AddCollaboratorPopper'

interface Props {
  userID: string
  popperProps: PopperChildrenProps
  handleIsRoleSelected: () => void
  addCollaborator: (userID: string, role: string) => Promise<void>
}

class AddCollaboratorPopperContainer extends React.Component<Props> {
  public render() {
    const { popperProps } = this.props

    return (
      <CustomPopper popperProps={popperProps}>
        <AddCollaboratorPopper addCollaborator={this.addCollaborator} />
      </CustomPopper>
    )
  }

  private addCollaborator = async (role: string) => {
    const { userID, addCollaborator, handleIsRoleSelected } = this.props

    await addCollaborator(userID, role)
    handleIsRoleSelected()
  }
}

export default AddCollaboratorPopperContainer
