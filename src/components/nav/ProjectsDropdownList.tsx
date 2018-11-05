import React from 'react'
import AddAuthor from '../../icons/add-author'
import { Project, ProjectInvitation } from '../../types/models'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { projectListCompare } from '../projects/ProjectsPageContainer'
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

export const ProjectsDropdownList: React.SFC<Props> = ({
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
        Add new project
      </DropdownSection>
    </React.Fragment>
  )
}
