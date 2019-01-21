import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import AlertMessage, { AlertMessageType } from '../AlertMessage'

import { InvitationData } from '../nav/ProjectsDropdownButton'
import { Invitation } from './InvitationElement'

interface Props {
  invitationsData: InvitationData[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
  acceptInvitation: (invitation: ProjectInvitation) => void
  rejectInvitation: (invitation: ProjectInvitation) => void
}

export const InvitationsList: React.FunctionComponent<Props> = ({
  invitationsData,
  acceptInvitation,
  rejectInvitation,
  acceptError,
}) => {
  return (
    <React.Fragment>
      {invitationsData.map(({ invitation, invitingUserProfile }) => (
        <React.Fragment>
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
            rejectInvitation={rejectInvitation}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
