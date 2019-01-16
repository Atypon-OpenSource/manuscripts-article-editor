import {
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import AddAuthor from '../../icons/add-author'
import { projectListCompare } from '../../lib/projects'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { DropdownSeparator } from './Dropdown'
import {
  AllProjectsDropdownSection,
  DropdownSection,
  InvitationDropdownSection,
  ProjectDropdownSection,
} from './ProjectDropdown'
import { InvitationData } from './ProjectsDropdownButton'

interface Props {
  handleClose?: React.MouseEventHandler<HTMLElement>
  projects: Project[]
  invitationsData: InvitationData[]
  acceptedInvitations: string[]
  rejectedInvitations: string[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
  acceptInvitation: (invitation: ProjectInvitation) => void
  rejectInvitation: (invitation: ProjectInvitation) => void
  addProject: () => void
}

export const ProjectsDropdownList: React.FunctionComponent<Props> = ({
  addProject,
  projects,
  invitationsData,
  acceptedInvitations,
  acceptInvitation,
  rejectInvitation,
  handleClose,
  acceptError,
}) => {
  const hasContent = invitationsData.length || projects.length

  return (
    <React.Fragment>
      {!!hasContent && <AllProjectsDropdownSection />}

      {!!hasContent && <DropdownSeparator />}

      {invitationsData.map(({ invitation, invitingUserProfile }) => (
        <React.Fragment>
          {acceptError &&
            acceptError.invitationId === invitation._id && (
              <AlertMessage type={AlertMessageType.error}>
                {acceptError.errorMessage}
              </AlertMessage>
            )}
          <InvitationDropdownSection
            key={invitation._id}
            invitation={invitation}
            invitingUserProfile={invitingUserProfile}
            acceptInvitation={acceptInvitation}
            rejectInvitation={rejectInvitation}
          />
        </React.Fragment>
      ))}

      {projects.sort(projectListCompare).map(project => (
        <ProjectDropdownSection
          key={project._id}
          handleClose={handleClose}
          project={project}
          accepted={acceptedInvitations.includes(project._id)}
        />
      ))}

      {!!projects.length && <DropdownSeparator />}

      <DropdownSection onClick={addProject} icon={<AddAuthor size={18} />}>
        New Project
      </DropdownSection>
    </React.Fragment>
  )
}
