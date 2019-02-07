import ShareProjectIcon from '@manuscripts/assets/react/Share'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { IconButton } from '@manuscripts/style-guide'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
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
}

class ShareProjectButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
  }

  public render() {
    const { project, user } = this.props
    const { isOpen } = this.state

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <ShareIconButton ref={ref} onClick={this.togglePopper}>
              <ShareProjectIcon />
            </ShareIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper
            placement={'bottom'}
            innerRef={(node: HTMLDivElement) => (this.node = node)}
          >
            {(popperProps: PopperChildrenProps) => (
              <div ref={(node: HTMLDivElement) => (this.node = node)}>
                <ShareProjectPopperContainer
                  project={project}
                  popperProps={popperProps}
                  user={user}
                />
              </div>
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

export default ShareProjectButton
