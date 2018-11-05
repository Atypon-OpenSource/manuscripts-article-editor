import React from 'react'
import { Category, Dialog } from '../Dialog'

interface Props {
  selectedRole: string
  handleUpdateRole: (selectedRole: string) => void
  handleCancel: () => void
  updating: boolean
}

class UpdateRolePageContainer extends React.Component<Props> {
  public render() {
    const actions = {
      primary: {
        action: this.props.handleCancel,
        title: 'Cancel',
      },
      secondary: {
        action: this.handleUpdate,
        title: 'Update Role',
        isDestructive: true,
      },
    }
    return (
      <Dialog
        isOpen={this.props.updating}
        actions={actions}
        category={Category.confirmation}
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
