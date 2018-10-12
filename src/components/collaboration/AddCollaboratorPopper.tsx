import React from 'react'
import { PopperBody } from '../Popper'
import { CollaboratorRolesInput } from './CollaboratorRolesInput'

interface State {
  selectedRole: string
}

interface Props {
  addCollaborator: (role: string) => Promise<void>
}

class AddCollaboratorPopper extends React.Component<Props, State> {
  public state: State = {
    selectedRole: '',
  }

  public async componentWillUnmount() {
    const { selectedRole } = this.state

    if (selectedRole) {
      try {
        await this.props.addCollaborator(selectedRole)
      } catch (error) {
        alert(error)
      }
    }
  }

  public render() {
    const { selectedRole } = this.state

    return (
      <PopperBody>
        <CollaboratorRolesInput
          name={'role'}
          value={selectedRole}
          onChange={this.handleRoleChange}
        />
      </PopperBody>
    )
  }
  private handleRoleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      selectedRole: event.currentTarget.value,
    })
  }
}

export default AddCollaboratorPopper
