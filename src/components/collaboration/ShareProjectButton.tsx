import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import UserData from '../../data/UserData'
import ShareProjectIcon from '../../icons/shareProject'
import { getCurrentUserId } from '../../lib/user'
import { styled } from '../../theme'
import { IconButton } from '../Button'
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
    const { isOpen } = this.state

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <ShareIconButton
              // @ts-ignore: styled
              ref={ref}
              onClick={this.togglePopper}
            >
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
                <UserData userID={getCurrentUserId()!}>
                  {user => (
                    <ShareProjectPopperContainer
                      project={this.props.project}
                      popperProps={popperProps}
                      user={user}
                    />
                  )}
                </UserData>
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
