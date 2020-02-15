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

import ShareProjectIcon from '@manuscripts/assets/react/Share'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { IconButton, Tip } from '@manuscripts/style-guide'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { TokenActions } from '../../data/TokenData'
import { styled } from '../../theme/styled-components'
import ShareProjectPopperContainer from './ShareProjectPopperContainer'

const Container = styled.div`
  display: flex;
`
const ShareIconButton = styled(IconButton).attrs({
  size: 24,
})`
  svg {
    text[fill],
    rect[fill],
    path[fill] {
      fill: ${props => props.theme.colors.brand.medium};
    }
    path[stroke] {
      stroke: ${props => props.theme.colors.brand.medium};
    }
  }
`

interface State {
  isOpen: boolean
}

interface Props {
  project: Project
  user: UserProfileWithAvatar
  tokenActions: TokenActions
}

class ShareProjectButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
  }

  private nodeRef: React.RefObject<HTMLDivElement> = React.createRef()

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
  }

  public render() {
    const { project, user, tokenActions } = this.props
    const { isOpen } = this.state

    return (
      <Container ref={this.nodeRef} onClick={event => event.stopPropagation()}>
        <Manager>
          <Tip title="Share this project" placement="right">
            <Reference>
              {({ ref }) => (
                <ShareIconButton
                  ref={ref}
                  onClick={this.toggleOpen}
                  aria-label="Share project"
                >
                  <ShareProjectIcon />
                </ShareIconButton>
              )}
            </Reference>
          </Tip>
          {isOpen && (
            <Popper placement={'bottom'}>
              {(popperProps: PopperChildrenProps) => (
                <div>
                  <ShareProjectPopperContainer
                    project={project}
                    popperProps={popperProps}
                    user={user}
                    tokenActions={tokenActions}
                  />
                </div>
              )}
            </Popper>
          )}
        </Manager>
      </Container>
    )
  }

  private toggleOpen = () => {
    this.setOpen(!this.state.isOpen)
  }

  private setOpen = (isOpen: boolean) => {
    this.setState({ isOpen })
    this.updateListener(isOpen)
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (
      this.nodeRef.current &&
      !this.nodeRef.current.contains(event.target as Node)
    ) {
      this.setOpen(false)
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

export default ShareProjectButton
