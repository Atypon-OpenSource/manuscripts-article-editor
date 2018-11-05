import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { Contributor, Project } from '../types/models'
import { TextButton } from './AlertMessage'
import InviteAuthorPopperContainer from './metadata/InviteAuthorPopperContainer'

interface State {
  isOpen: boolean
}

interface Props {
  author: Contributor
  project: Project
  updateAuthor: (author: Contributor, email: string) => void
}

class InviteAuthorButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
  }

  private node: Node
  private closedNow: boolean = false

  public componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false)
  }

  public componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false)
  }

  public render() {
    const { isOpen } = this.state

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <TextButton
              // @ts-ignore: styled
              ref={ref}
              onClick={this.openPopper}
            >
              Invite as Collaborator
            </TextButton>
          )}
        </Reference>
        {isOpen && (
          <Popper placement={'bottom'}>
            {(popperProps: PopperChildrenProps) => (
              <div ref={(node: HTMLDivElement) => (this.node = node)}>
                <InviteAuthorPopperContainer
                  popperProps={popperProps}
                  project={this.props.project}
                  author={this.props.author}
                  updateAuthor={this.props.updateAuthor}
                />
              </div>
            )}
          </Popper>
        )}
      </Manager>
    )
  }

  private openPopper = () => {
    if (!this.closedNow) {
      this.setState({
        isOpen: true,
      })
    }
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (this.node && !this.node.contains(event.target as Node)) {
      this.setState({
        isOpen: false,
      })

      this.closedNow = true

      setTimeout(() => {
        this.closedNow = false
      }, 100)
    }
  }
}

export default InviteAuthorButton
