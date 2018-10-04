import React from 'react'
import { Category, Dialog } from '../components/Popper'

interface Props {
  selectedRole: string
  handleUpdateRole: (selectedRole: string) => void
  handleCancel: () => void
  updating: boolean
}

class UpdateRolePageContainer extends React.Component<Props> {
  public render() {
    return (
      <Dialog
        isOpen={this.props.updating}
        primaryAction={this.props.handleCancel}
        secondaryAction={this.handleUpdate}
        secondaryActionTitle={'Update Role'}
        primaryActionTitle={'Cancel'}
        category={Category.error}
        header={'Update collaborator role'}
        message={'Are you sure you want to update collaborator role?'}
      />
    )
  }

  private handleUpdate = () => {
    try {
      this.props.handleUpdateRole(this.props.selectedRole)
      this.props.handleCancel()
    } catch (error) {
      alert(error)
    }
  }
}

export default UpdateRolePageContainer
