import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import AddCollaboratorPopper from '../components/AddCollaboratorPopper'
import { CustomPopper } from '../components/Popper'

interface Props {
  userID: string
  popperProps: PopperChildrenProps
  handleIsRoleSelected: () => void
  addCollaborator: (userID: string, role: string) => Promise<void>
}

class AddCollaboratorPopperContainer extends React.Component<Props> {
  public render() {
    const { popperProps } = this.props

    return (
      <CustomPopper popperProps={popperProps}>
        <AddCollaboratorPopper addCollaborator={this.addCollaborator} />
      </CustomPopper>
    )
  }

  private addCollaborator = (role: string) => {
    const { userID } = this.props

    return this.props
      .addCollaborator(userID, role)
      .then(this.props.handleIsRoleSelected)
  }
}

export default AddCollaboratorPopperContainer
