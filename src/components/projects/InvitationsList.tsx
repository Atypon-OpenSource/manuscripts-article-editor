import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor/dist/types'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { InvitationData } from '../nav/ProjectsButton'
import { Invitation } from './InvitationElement'

interface Props {
  invitationsData: InvitationData[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
  acceptInvitation: (invitation: ProjectInvitation) => void
  confirmReject: (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ProjectInvitation
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
          {acceptError &&
            acceptError.invitationId === invitation._id && (
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
