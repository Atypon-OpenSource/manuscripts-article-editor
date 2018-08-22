import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import CollaboratorSettingsPopperContainer from '../containers/CollaboratorSettingsPopperContainer'
import SettingsInverted from '../icons/settings-inverted-icon'
import { styled } from '../theme'
import { UserProfile } from '../types/components'
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
}

interface Props {
  projectID: string
  collaborator: UserProfile
  openPopper: (isOpen: boolean) => void
}

class CollaboratorSettingsButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
  }

  public render() {
    const { isOpen } = this.state
    const { projectID, collaborator } = this.props

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <AddIconButton onClick={this.openPopper} innerRef={ref}>
              <SettingsInverted color={'#7fb5d5'} />
            </AddIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper placement={'bottom'}>
            {(popperProps: PopperChildrenProps) => (
              <CollaboratorSettingsPopperContainer
                projectID={projectID}
                collaborator={collaborator}
                popperProps={popperProps}
                openPopper={this.openPopper}
              />
            )}
          </Popper>
        )}
      </Manager>
    )
  }

  private openPopper = () => {
    this.props.openPopper(!this.state.isOpen)
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
}

export default CollaboratorSettingsButton
