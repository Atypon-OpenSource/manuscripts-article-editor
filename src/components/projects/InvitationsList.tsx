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

import { ContainerInvitation } from '@manuscripts/manuscripts-json-schema'
import { AlertMessage, AlertMessageType } from '@manuscripts/style-guide'
import React from 'react'

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { InvitationData } from '../nav/ProjectsButton'
import { Invitation } from './InvitationElement'

interface Props {
  invitationsData: InvitationData[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
  acceptInvitation: (invitation: ContainerInvitation) => void
  confirmReject: (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ContainerInvitation
  ) => void
}

export const InvitationsList: React.FunctionComponent<Props> = ({
  invitationsData,
  acceptInvitation,
  acceptError,
  confirmReject,
}) => {
  return (
    <div>
      {invitationsData.map(({ invitation, invitingUserProfile }) => (
        <React.Fragment key={invitation._id}>
          {acceptError && acceptError.invitationId === invitation._id && (
            <AlertMessage type={AlertMessageType.error}>
              {acceptError.errorMessage}
            </AlertMessage>
          )}
          <Invitation
            key={invitation._id}
            invitation={invitation}
            invitingUserProfile={invitingUserProfile}
            acceptInvitation={acceptInvitation}
            confirmReject={confirmReject}
          />
        </React.Fragment>
      ))}
    </div>
  )
}
