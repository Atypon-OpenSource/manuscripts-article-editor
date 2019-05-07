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

import ShareProjectIcon from '@manuscripts/assets/react/Share'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { IconButton } from '@manuscripts/style-guide'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { TokenActions } from '../../data/TokenData'
import { styled } from '../../theme/styled-components'
import ShareProjectPopperContainer from './ShareProjectPopperContainer'

const ShareIconButton = styled(IconButton)`
  height: unset;
  width: unset;

  &:focus {
    outline: none;
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
      <div ref={this.nodeRef} onClick={event => event.stopPropagation()}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <ShareIconButton ref={ref} onClick={this.toggleOpen}>
                <ShareProjectIcon />
              </ShareIconButton>
            )}
          </Reference>
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
      </div>
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
