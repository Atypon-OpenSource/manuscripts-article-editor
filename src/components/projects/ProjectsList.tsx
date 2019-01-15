import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { aliceBlue, aquaHaze, dustyGrey } from '../../colors'
import { buildCollaborators } from '../../lib/collaborators'
import { projectListCompare } from '../../lib/projects'
import { styled } from '../../theme'
import EditProjectButton from '../collaboration/EditProjectButton'
import ShareProjectButton from '../collaboration/ShareProjectButton'

const SidebarProject = styled.div`
  padding: 16px;
  margin: 0 -16px;
  border: 1px solid transparent;
  border-bottom-color: #eaecee;
  width: 500px;
  border-radius: 4px;

  &:hover {
    background-color: ${aliceBlue};
    border-color: ${aquaHaze};
  }

  @media (max-width: 450px) {
    width: unset;
  }
`

const SidebarProjectHeader = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-left: 7px;
  }
`

const ProjectTitle = styled(NavLink)`
  font-size: 19px;
  font-weight: 500;
  font-style: normal;
  flex: 1;
  color: inherit;
  text-decoration: none;
  display: block;
`

const ProjectContributors = styled.div`
  font-size: 15px;
  margin-top: 8px;

  @media (max-width: 450px) {
    margin-left: 7px;
  }
`

const PlaceholderTitle = styled(Title)`
  color: ${dustyGrey};
`

const ProjectContributor = styled.span``

const Edit = styled.div`
  margin-bottom: 5px;
`

const initials = (name: BibliographicName): string =>
  name.given
    ? name.given
        .split(' ')
        .map(part => part.substr(0, 1).toUpperCase() + '.')
        .join('')
    : ''

interface Props {
  projects: Project[]
  users: Map<string, UserProfileWithAvatar>
}

export const ProjectsList: React.FunctionComponent<Props> = ({
  projects,
  users,
}) => (
  <div>
    {projects.sort(projectListCompare).map(project => (
      <SidebarProject key={project._id}>
        <SidebarProjectHeader>
          <ProjectTitle to={`/projects/${project._id}`}>
            {project.title ? (
              <Title value={project.title} />
            ) : (
              <PlaceholderTitle value={'Untitled Project'} />
            )}
          </ProjectTitle>
          <Edit>
            <EditProjectButton project={project} />
          </Edit>
          <ShareProjectButton project={project} />
        </SidebarProjectHeader>

        <ProjectContributors>
          {buildCollaborators(project, users).map((collaborator, index) => (
            <React.Fragment key={collaborator._id}>
              {!!index && ', '}
              <ProjectContributor key={collaborator._id}>
                {initials(collaborator.bibliographicName)}{' '}
                {collaborator.bibliographicName.family}
              </ProjectContributor>
            </React.Fragment>
          ))}
        </ProjectContributors>
      </SidebarProject>
    ))}
  </div>
)
