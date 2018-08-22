import React from 'react'
import { InvitationData } from '../containers/ProjectsDropdownButton'
import AddAuthor from '../icons/add-author'
import { Project, ProjectInvitation } from '../types/components'
import { DropdownSeparator } from './Dropdown'
import {
  AllProjectsDropdownSection,
  DropdownSection,
  InvitationDropdownSection,
  ProjectDropdownSection,
} from './ProjectDropdown'

interface Props {
  handleClose?: React.MouseEventHandler<HTMLElement>
  projects: Project[]
  invitationsData: InvitationData[]
  acceptedInvitations: string[]
  rejectedInvitations: string[]
  acceptInvitation: (invitation: ProjectInvitation) => void
  rejectInvitation: (invitation: ProjectInvitation) => void
  addProject: () => void
}

export const ProjectsDropdownList: React.SFC<Props> = ({
  addProject,
  projects,
  invitationsData,
  acceptedInvitations,
  rejectedInvitations,
  acceptInvitation,
  rejectInvitation,
  handleClose,
}) => {
  const acceptedInvitationsData = invitationsData.filter(({ project }) =>
    acceptedInvitations.includes(project.id)
  )

  const openInvitationsData = invitationsData.filter(
    ({ project }) =>
      !acceptedInvitations.includes(project.id) &&
      !rejectedInvitations.includes(project.id)
  )

  const otherProjects = projects.filter(
    project => !acceptedInvitations.includes(project.id)
  )

  const hasContent = invitationsData.length || projects.length

  return (
    <React.Fragment>
      {!!hasContent && <AllProjectsDropdownSection />}

      {!!hasContent && <DropdownSeparator />}

      {acceptedInvitationsData.map(({ invitation, project }) => (
        <ProjectDropdownSection
          key={invitation.id}
          handleClose={handleClose}
          project={project}
          accepted={true}
        />
      ))}

      {openInvitationsData.map(({ invitation, invitingUserProfile }) => (
        <InvitationDropdownSection
          key={invitation.id}
          invitation={invitation}
          invitingUserProfile={invitingUserProfile}
          acceptInvitation={acceptInvitation}
          rejectInvitation={rejectInvitation}
        />
      ))}

      {otherProjects.map(project => (
        <ProjectDropdownSection
          key={project.id}
          handleClose={handleClose}
          project={project}
        />
      ))}

      {!!otherProjects.length && <DropdownSeparator />}

      <DropdownSection onClick={addProject} icon={<AddAuthor size={18} />}>
        Add new project
      </DropdownSection>
    </React.Fragment>
  )
}
