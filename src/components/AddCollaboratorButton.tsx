import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import AddCollaboratorPopperContainer from '../containers/AddCollaboratorPopperContainer'
import AddIconActive from '../icons/add-icon-active'
import AddIconInverted from '../icons/add-icon-inverted'
import AddedIcon from '../icons/added-icon'
import { styled } from '../theme'
import { UserProfile } from '../types/components'
import { IconButton } from './Button'

const AddIconButton = styled(IconButton)`
  display: flex;
  align-items: center;
  justify-content: center;

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

  public componentDidMount() {
    this.setState({
      isSelected: this.props.isSelected || false,
    })
  }

  public render() {
    const { isOpen, isSelected } = this.state

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
            <AddIconButton onClick={this.togglePopper} innerRef={ref}>
              {isOpen ? (
                <AddIconActive color={'#7fb5d5'} />
              ) : (
                <AddIconInverted color={'#7fb5d5'} />
              )}
            </AddIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper placement={'bottom'}>
            {(popperProps: PopperChildrenProps) => (
              <AddCollaboratorPopperContainer
                userID={this.props.collaborator.userID}
                popperProps={popperProps}
                addCollaborator={this.props.addCollaborator}
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
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
}

export default AddCollaboratorButton
