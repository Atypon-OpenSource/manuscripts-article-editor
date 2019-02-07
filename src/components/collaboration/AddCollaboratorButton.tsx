import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import { IconButton } from '@manuscripts/style-guide'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import AddIconActive from '../../icons/add-icon-active'
import AddIconInverted from '../../icons/add-icon-inverted'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'
import AddCollaboratorPopperContainer from './AddCollaboratorPopperContainer'

const AddIconButton = styled(IconButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: unset;
  height: unset;

  &:focus {
    outline: none;
  }
`

interface State {
  isOpen: boolean
  isSelected: boolean
}

interface Props {
  collaborator: UserProfile
  isSelected?: boolean
  countAddedCollaborators: () => void
  addCollaborator: (userID: string, role: string) => Promise<void>
}

class AddCollaboratorButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    isSelected: false,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
    this.setState({
      isSelected: this.props.isSelected || false,
    })
  }

  public render() {
    const { isOpen, isSelected } = this.state
    const { addCollaborator, collaborator } = this.props

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
                <AddIconActive color={theme.colors.icon.primary} />
              ) : (
                <AddIconInverted color={theme.colors.icon.primary} />
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
                addCollaborator={addCollaborator}
                handleIsRoleSelected={this.handleIsRoleSelected}
              />
            )}
          </Popper>
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
}

export default AddCollaboratorButton
