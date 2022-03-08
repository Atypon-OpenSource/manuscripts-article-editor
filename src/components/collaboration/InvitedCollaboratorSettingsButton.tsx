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
import { ContainerInvitation } from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog, IconButton } from '@manuscripts/style-guide'
import { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import styled from 'styled-components'

import { TokenActions } from '../../store'
import InviteCollaboratorPopperContainer from './InviteCollaboratorPopperContainer'

const AddIconButton = styled(IconButton)`
  display: flex;
  height: 24px;
  width: 40px;

  &:focus {
    outline: none;
  }
`

const SettingsInvertedIcon = styled(SettingsInverted)`
  g {
    stroke: ${(props) => props.theme.colors.brand.default};
  }
`

interface State {
  isOpen: boolean
  isUpdateRoleOpen: boolean
  error: { data: AxiosError; message: string } | null
  resendSucceed: boolean | null
}

interface Props {
  invitation: ContainerInvitation
  openPopper: (isOpen: boolean) => void
  projectInvite: (
    email: string,
    role: string,
    name?: string,
    message?: string
  ) => Promise<void>
  projectUninvite: (invitationID: string) => Promise<void>
  tokenActions: TokenActions
}

class InvitedCollaboratorSettingsButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    isUpdateRoleOpen: false,
    error: null,
    resendSucceed: null,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
  }

  public render() {
    const { isOpen, isUpdateRoleOpen, resendSucceed } = this.state

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <AddIconButton ref={ref} onClick={this.openPopper}>
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
              <InviteCollaboratorPopperContainer
                invitation={this.props.invitation}
                popperProps={popperProps}
                isUpdateRoleOpen={isUpdateRoleOpen}
                handleOpenModal={this.handleOpenModal}
                handleUpdateRole={this.handleUpdateRole}
                handleUninvite={this.handleUninvite}
                resendInvitation={this.resendInvitation}
                resendSucceed={resendSucceed}
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
              StatusCodes.SERVICE_UNAVAILABLE
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

  private openPopper = () => {
    this.props.openPopper(!this.state.isOpen)
    this.updateListener(!this.state.isOpen)
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  private handleOpenModal = () => {
    this.setState({
      isUpdateRoleOpen: !this.state.isUpdateRoleOpen,
    })
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (
      this.node &&
      !this.node.contains(event.target as Node) &&
      !this.state.isUpdateRoleOpen
    ) {
      this.openPopper()
    }
  }

  private updateListener = (isOpen: boolean) => {
    if (isOpen) {
      document.addEventListener('mousedown', this.handleClickOutside)
    } else {
      document.removeEventListener('mousedown', this.handleClickOutside)
    }
  }

  private handleUpdateRole = async (role: string) => {
    const {
      invitedUserEmail: email,
      invitedUserName: name,
      message,
    } = this.props.invitation

    const { projectInvite } = this.props

    try {
      await projectInvite(email, role, name, message)
      this.openPopper()
    } catch (error) {
      if (
        error.response &&
        error.response.status === StatusCodes.UNAUTHORIZED
      ) {
        this.props.tokenActions.delete()
      } else {
        this.setState({
          error: { data: error, message: 'Failed to update invitation role' },
        })
      }
    }
  }

  private resendInvitation = async () => {
    const {
      invitedUserEmail: email,
      invitedUserName: name,
      message,
      role,
    } = this.props.invitation

    const { projectInvite } = this.props

    try {
      await projectInvite(email, role, name, message)
      this.setState({
        resendSucceed: true,
      })
    } catch (error) {
      if (
        error.response &&
        error.response.status === StatusCodes.UNAUTHORIZED
      ) {
        this.props.tokenActions.delete()
      } else {
        this.setState({
          resendSucceed: false,
        })
      }
    }
  }

  private handleUninvite = async () => {
    const { invitation, projectUninvite } = this.props

    try {
      await projectUninvite(invitation._id)
      this.openPopper()
    } catch (error) {
      if (
        error.response &&
        error.response.status === StatusCodes.UNAUTHORIZED
      ) {
        this.props.tokenActions.delete()
      } else {
        this.setState({
          error: { data: error, message: 'Uninvite user failed' },
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

export default InvitedCollaboratorSettingsButton
