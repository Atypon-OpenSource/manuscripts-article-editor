import SettingsInverted from '@manuscripts/assets/react/SettingsInverted'
import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { styled, theme } from '../../theme'
import { IconButton } from '../Button'
import InviteCollaboratorPopperContainer from './InviteCollaboratorPopperContainer'

const AddIconButton = styled(IconButton)`
  display: flex;
  height: 24px;
  width: 40px;

  &:focus {
    outline: none;
  }
`

const SettingsInvertedIcon = styled(SettingsInverted)`
  g {
    stroke: ${props => props.theme.colors.icon.primary};
  }
`

interface State {
  isOpen: boolean
  isUpdateRoleOpen: boolean
}

interface Props {
  invitation: ProjectInvitation
  openPopper: (isOpen: boolean) => void
  projectInvite: (
    email: string,
    role: string,
    name?: string,
    message?: string
  ) => Promise<void>
  projectUninvite: (invitationID: string) => Promise<void>
}

class InvitedCollaboratorSettingsButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    isUpdateRoleOpen: false,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
  }

  public render() {
    const { isOpen, isUpdateRoleOpen } = this.state
    const { projectInvite, projectUninvite } = this.props

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <AddIconButton ref={ref} onClick={this.openPopper}>
              <SettingsInvertedIcon color={theme.colors.icon.primary} />
            </AddIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper
            placement={'bottom'}
            innerRef={(node: HTMLDivElement) => (this.node = node)}
          >
            {(popperProps: PopperChildrenProps) => (
              <InviteCollaboratorPopperContainer
                invitation={this.props.invitation}
                popperProps={popperProps}
                projectInvite={projectInvite}
                projectUninvite={projectUninvite}
                openPopper={this.openPopper}
                isUpdateRoleOpen={isUpdateRoleOpen}
                handleOpenModal={this.handleOpenModal}
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
      isUpdateRoleOpen: !this.state.isUpdateRoleOpen,
    })
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (
      this.node &&
      !this.node.contains(event.target as Node) &&
      !this.state.isUpdateRoleOpen
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

export default InvitedCollaboratorSettingsButton
