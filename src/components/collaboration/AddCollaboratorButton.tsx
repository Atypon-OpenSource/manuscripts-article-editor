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

import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import {
  AddIconActive,
  AddIconInverted,
  Category,
  Dialog,
  IconButton,
} from '@manuscripts/style-guide'
import { AxiosError } from 'axios'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import styled from 'styled-components'
import { TokenActions } from '../../data/TokenData'
import { theme } from '../../theme/theme'
import AddCollaboratorPopperContainer from './AddCollaboratorPopperContainer'

const AddIconButton = styled(IconButton).attrs(props => ({
  defaultColor: true,
}))`
  width: unset;
  height: unset;
  margin-left: ${props => props.theme.grid.unit * 2}px;

  &:focus {
    outline: none;
  }
`

interface State {
  isOpen: boolean
  isSelected: boolean
  error: AxiosError | null
}

interface Props {
  collaborator: UserProfile
  isSelected?: boolean
  countAddedCollaborators: () => void
  addCollaborator: (userID: string, role: string) => Promise<void>
  tokenActions: TokenActions
}

class AddCollaboratorButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    isSelected: false,
    error: null,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
    this.setState({
      isSelected: this.props.isSelected || false,
    })
  }

  public render() {
    const { isOpen, isSelected, error } = this.state
    const { collaborator } = this.props

    if (isSelected) {
      return (
        <AddIconButton>
          <AddedIcon />
        </AddIconButton>
      )
    }

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <AddIconButton ref={ref} onClick={this.togglePopper}>
              {isOpen ? (
                <AddIconActive color={theme.colors.brand.medium} />
              ) : (
                <AddIconInverted color={theme.colors.brand.medium} />
              )}
            </AddIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper
            placement={'bottom'}
            innerRef={(node: HTMLDivElement) => (this.node = node)}
          >
            {(popperProps: PopperChildrenProps) => (
              <AddCollaboratorPopperContainer
                userID={collaborator.userID}
                popperProps={popperProps}
                addCollaborator={this.addCollaborator}
                handleIsRoleSelected={this.handleIsRoleSelected}
              />
            )}
          </Popper>
        )}
        {error && (
          <Dialog
            isOpen={true}
            category={Category.error}
            header={'Add collaborator failed'}
            message={
              error.response!.status === HttpStatusCodes.SERVICE_UNAVAILABLE
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

  private handleIsRoleSelected = () => {
    this.setState({
      isSelected: true,
    })

    this.props.countAddedCollaborators()
  }

  private togglePopper = () => {
    this.updateListener(!this.state.isOpen)
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (this.node && !this.node.contains(event.target as Node)) {
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

  private handleCancel = () => {
    this.setState({
      error: null,
    })
  }

  private addCollaborator = async (role: string) => {
    const { collaborator, addCollaborator, tokenActions } = this.props

    try {
      await addCollaborator(collaborator.userID, role)
      this.handleIsRoleSelected()
    } catch (error) {
      if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
        tokenActions.delete()
      } else {
        this.setState({ error })
      }
    }
  }
}

export default AddCollaboratorButton
