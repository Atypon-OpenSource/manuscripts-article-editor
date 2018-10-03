import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import CollaboratorSettingsPopperContainer from '../containers/CollaboratorSettingsPopperContainer'
import SettingsInverted from '../icons/settings-inverted-icon'
import { styled } from '../theme'
import { Project, UserProfile } from '../types/components'
import { IconButton } from './Button'

const AddIconButton = styled(IconButton)`
  display: flex;
  height: 20px;
  width: 36px;

  &:focus {
    outline: none;
  }
`

interface State {
  isOpen: boolean
  updateRoleIsOpen: boolean
}

interface Props {
  project: Project
  collaborator: UserProfile
  openPopper: (isOpen: boolean) => void
}

class CollaboratorSettingsButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    updateRoleIsOpen: false,
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
            <AddIconButton
              // @ts-ignore: styled
              ref={ref}
              onClick={this.openPopper}
            >
              <SettingsInverted color={'#7fb5d5'} />
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
                openPopper={this.openPopper}
                handleOpenModal={this.handleOpenModal}
                updateRoleIsOpen={this.state.updateRoleIsOpen}
              />
            )}
          </Popper>
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
      updateRoleIsOpen: !this.state.updateRoleIsOpen,
    })
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (
      this.node &&
      !this.node.contains(event.target as Node) &&
      !this.state.updateRoleIsOpen
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
}

export default CollaboratorSettingsButton
