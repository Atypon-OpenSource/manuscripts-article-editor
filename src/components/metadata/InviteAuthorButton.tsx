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

import { Contributor, Project } from '@manuscripts/json-schema'
import { TextButton } from '@manuscripts/style-guide'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import styled from 'styled-components'

import { TokenActions } from '../../store'
import InviteAuthorPopperContainer from './InviteAuthorPopperContainer'

interface State {
  isOpen: boolean
}

interface Props {
  author: Contributor
  project: Project
  updateAuthor: (author: Contributor, email: string) => void
  tokenActions: TokenActions
}

const Button = styled(TextButton)`
  margin-left: ${(props) => props.theme.grid.unit * 3}px;
`

class InviteAuthorButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
  }

  public render() {
    const { isOpen } = this.state

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <Button ref={ref} onClick={this.togglePopper}>
              Invite as Collaborator
            </Button>
          )}
        </Reference>
        {isOpen && (
          <Popper
            placement={'bottom'}
            innerRef={(node: HTMLDivElement) => (this.node = node)}
          >
            {(popperProps: PopperChildrenProps) => (
              <InviteAuthorPopperContainer
                popperProps={popperProps}
                project={this.props.project}
                author={this.props.author}
                updateAuthor={this.props.updateAuthor}
                tokenActions={this.props.tokenActions}
              />
            )}
          </Popper>
        )}
      </Manager>
    )
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
}

export default InviteAuthorButton
