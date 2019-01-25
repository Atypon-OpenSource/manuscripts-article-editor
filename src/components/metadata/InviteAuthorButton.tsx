import { Contributor, Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { styled } from '../../theme'
import { TextButton } from '../AlertMessage'
import InviteAuthorPopperContainer from './InviteAuthorPopperContainer'

interface State {
  isOpen: boolean
}

interface Props {
  author: Contributor
  project: Project
  updateAuthor: (author: Contributor, email: string) => void
}

const Button = styled(TextButton)`
  margin-left: 10px;
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
