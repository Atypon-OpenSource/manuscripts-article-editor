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

import SettingsInverted from '@manuscripts/assets/react/SettingsInverted'
import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog, IconButton } from '@manuscripts/style-guide'
import { AxiosError } from 'axios'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { TokenActions } from '../../data/TokenData'
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
  error: { data: AxiosError; message: string } | null
}

interface Props {
  project: Project
  collaborator: UserProfile
  openPopper: (isOpen: boolean) => void
  updateUserRole: (role: ProjectRole | null, userID: string) => Promise<void>
  tokenActions: TokenActions
}

class CollaboratorSettingsButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    updateRoleIsOpen: false,
    error: null,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
  }

  public render() {
    const { isOpen } = this.state
    const { project, collaborator } = this.props

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
                updateUserRole={this.handleUpdateRole}
                handleRemove={this.handleRemove}
              />
            )}
          </Popper>
        )}
        {this.state.error && (
          <Dialog
            isOpen={true}
            category={Category.error}
            header={this.state.error.message}
            message={
              this.state.error.data.response!.status ===
              HttpStatusCodes.SERVICE_UNAVAILABLE
                ? 'Trouble reaching manuscripts.io servers. Please try again later.'
                : 'An error occurred.'
            }
            actions={{
              primary: {
                action: this.handleCancel,
                title: 'OK',
              },
            }}
          />
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

  private handleUpdateRole = async (selectedRole: string) => {
    const { collaborator, updateUserRole } = this.props

    try {
      await updateUserRole(selectedRole as ProjectRole, collaborator.userID)
      this.togglePopper()
    } catch (error) {
      if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
        this.props.tokenActions.delete()
      } else {
        this.setState({
          error: { data: error, message: 'Failed to update collaborator role' },
        })
      }
    }
  }

  private handleRemove = async () => {
    const { collaborator, updateUserRole } = this.props

    try {
      await updateUserRole(null, collaborator.userID)
      this.togglePopper()
    } catch (error) {
      if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
        this.props.tokenActions.delete()
      } else {
        this.setState({
          error: { data: error, message: 'Failed to remove collaborator' },
        })
      }
    }
  }

  private handleCancel = () => {
    this.setState({
      error: null,
    })
  }
}

export default CollaboratorSettingsButton
