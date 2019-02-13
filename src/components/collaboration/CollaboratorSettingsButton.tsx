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

import SettingsInverted from '@manuscripts/assets/react/SettingsInverted'
import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { IconButton } from '@manuscripts/style-guide'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { ProjectRole } from '../../lib/roles'
import { styled } from '../../theme/styled-components'
import CollaboratorSettingsPopperContainer from './CollaboratorSettingsPopperContainer'

const AddIconButton = styled(IconButton)`
  display: flex;
  height: unset;
  width: unset;

  &:focus {
    outline: none;
  }
`

const SettingsInvertedIcon = styled(SettingsInverted)`
  g {
    stroke: ${props => props.theme.colors.icon.primary};
  }
`

interface State {
  isOpen: boolean
  updateRoleIsOpen: boolean
}

interface Props {
  project: Project
  collaborator: UserProfile
  openPopper: (isOpen: boolean) => void
  updateUserRole: (role: ProjectRole | null, userID: string) => Promise<void>
}

class CollaboratorSettingsButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    updateRoleIsOpen: false,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
  }

  public render() {
    const { isOpen } = this.state
    const { project, collaborator, updateUserRole } = this.props

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <AddIconButton ref={ref} onClick={this.togglePopper}>
              <SettingsInvertedIcon />
            </AddIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper
            placement={'bottom'}
            innerRef={(node: HTMLDivElement) => (this.node = node)}
          >
            {(popperProps: PopperChildrenProps) => (
              <CollaboratorSettingsPopperContainer
                project={project}
                collaborator={collaborator}
                popperProps={popperProps}
                openPopper={this.togglePopper}
                handleOpenModal={this.handleOpenModal}
                updateRoleIsOpen={this.state.updateRoleIsOpen}
                updateUserRole={updateUserRole}
              />
            )}
          </Popper>
        )}
      </Manager>
    )
  }

  private togglePopper = () => {
    this.props.openPopper(!this.state.isOpen)
    this.updateListener(!this.state.isOpen)
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  private handleOpenModal = () => {
    this.setState({
      updateRoleIsOpen: !this.state.updateRoleIsOpen,
    })
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (
      this.node &&
      !this.node.contains(event.target as Node) &&
      !this.state.updateRoleIsOpen
    ) {
      this.togglePopper()
    }
  }

  private updateListener = (isOpen: boolean) => {
    if (isOpen) {
      document.addEventListener('mousedown', this.handleClickOutside)
    } else {
      document.removeEventListener('mousedown', this.handleClickOutside)
    }
  }
}

export default CollaboratorSettingsButton
