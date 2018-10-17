import React from 'react'
import AddAuthor from '../../icons/add-author'
import { Project, ProjectInvitation } from '../../types/models'
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
          key={invitation._id}
          invitation={invitation}
          invitingUserProfile={invitingUserProfile}
          acceptInvitation={acceptInvitation}
          rejectInvitation={rejectInvitation}
        />
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
