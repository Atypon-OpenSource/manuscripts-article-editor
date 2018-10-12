import React from 'react'
import { TransparentGreyButton } from '../Button'
import { PopperBody, SeparatorLine } from '../Popper'
import { CollaboratorRolesInput } from './CollaboratorRolesInput'

interface Props {
  selectedRole: string
  handleRoleChange: React.ChangeEventHandler<HTMLInputElement>
  switchMode: () => void
  removeText: string
}

export const CollaboratorRolePopper: React.SFC<Props> = ({
  selectedRole,
  handleRoleChange,
  switchMode,
  removeText,
}) => (
  <PopperBody size={250}>
    <CollaboratorRolesInput
      name={'role'}
      value={selectedRole}
      onChange={handleRoleChange}
    />
    <SeparatorLine />
    <TransparentGreyButton onClick={switchMode}>
      {removeText}
    </TransparentGreyButton>
  </PopperBody>
)
