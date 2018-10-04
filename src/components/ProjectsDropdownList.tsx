import React from 'react'
import { InvitationData } from '../containers/ProjectsDropdownButton'
import { projectListCompare } from '../containers/ProjectsPageContainer'
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
  acceptInvitation,
  rejectInvitation,
  handleClose,
}) => {
  const hasContent = invitationsData.length || projects.length

  return (
    <React.Fragment>
      {!!hasContent && <AllProjectsDropdownSection />}

      {!!hasContent && <DropdownSeparator />}

      {invitationsData.map(({ invitation, invitingUserProfile }) => (
        <InvitationDropdownSection
          key={invitation.id}
          invitation={invitation}
          invitingUserProfile={invitingUserProfile}
          acceptInvitation={acceptInvitation}
          rejectInvitation={rejectInvitation}
        />
      ))}

      {projects.sort(projectListCompare).map(project => (
        <ProjectDropdownSection
          key={project.id}
          handleClose={handleClose}
          project={project}
          accepted={acceptedInvitations.includes(project.id)}
        />
      ))}

      {!!projects.length && <DropdownSeparator />}

      <DropdownSection onClick={addProject} icon={<AddAuthor size={18} />}>
        Add new project
      </DropdownSection>
    </React.Fragment>
  )
}
