import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { CustomPopper } from '../Popper'
import AddCollaboratorPopper from './AddCollaboratorPopper'

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

  private addCollaborator = async (role: string) => {
    const { userID, addCollaborator, handleIsRoleSelected } = this.props

    await addCollaborator(userID, role)
    handleIsRoleSelected()
  }
}

export default AddCollaboratorPopperContainer
