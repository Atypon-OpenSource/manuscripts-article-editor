/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AlertMessage,
  AlertMessageType,
  GreyButton,
  PrimaryButton,
} from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { PopperBody, SeparatorLine } from '../Popper'
import { CollaboratorRolesInput } from './CollaboratorRolesInput'
import { Mode } from './InviteCollaboratorPopper'

const ButtonContainer = styled.div`
  margin-left: 4px;
`
const Container = styled.div`
  display: flex;
`

const AlertMessageContainer = styled.div`
  margin-bottom: 9px;
`
interface Props {
  selectedRole: string
  handleRoleChange: React.ChangeEventHandler<HTMLInputElement>
  switchMode: () => void
  removeText: string
  resendInvitation?: () => void
  resendSucceed?: boolean | null
  invitedUserEmail?: string
  selectedMode?: Mode
  isOnlyOwner: boolean
}

export const CollaboratorRolePopper: React.FunctionComponent<Props> = ({
  selectedRole,
  handleRoleChange,
  switchMode,
  removeText,
  resendInvitation,
  resendSucceed,
  invitedUserEmail,
  selectedMode,
  isOnlyOwner,
}) => (
  <PopperBody size={250}>
    {isOnlyOwner && (
      <AlertMessageContainer>
        <AlertMessage type={AlertMessageType.info} hideCloseButton={true}>
          Role change not permitted because you are the only owner.
        </AlertMessage>
      </AlertMessageContainer>
    )}
    {selectedMode === 'invite' &&
      resendSucceed !== null &&
      (resendSucceed ? (
        <AlertMessageContainer>
          <AlertMessage type={AlertMessageType.success}>
            Invitation has been re-sent to {invitedUserEmail}.
          </AlertMessage>
        </AlertMessageContainer>
      ) : (
        <AlertMessageContainer>
          <AlertMessage type={AlertMessageType.error}>
            Failed to re-send invitation to {invitedUserEmail}.
          </AlertMessage>
        </AlertMessageContainer>
      ))}
    <CollaboratorRolesInput
      name={'role'}
      value={selectedRole}
      onChange={handleRoleChange}
      disabled={isOnlyOwner}
    />
    <SeparatorLine />
    <Container>
      <GreyButton onClick={switchMode} disabled={isOnlyOwner}>
        {removeText}
      </GreyButton>
      {selectedMode === 'invite' && (
        <ButtonContainer>
          <PrimaryButton onClick={resendInvitation}>Resend</PrimaryButton>
        </ButtonContainer>
      )}
    </Container>
  </PopperBody>
)
