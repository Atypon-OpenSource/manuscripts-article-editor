import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { aliceBlue, aquaHaze, dustyGrey } from '../../colors'
import TickMark from '../../icons/tick-mark'
import { buildCollaborators } from '../../lib/collaborators'
import { projectListCompare } from '../../lib/projects'
import { styled, ThemedProps } from '../../theme'
import ShareProjectButton from '../collaboration/ShareProjectButton'
import ProjectContextMenuButton from './ProjectContextMenuButton'

type ThemedDivProps = ThemedProps<HTMLDivElement>

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
const AcceptedLabel = styled.div`
  display: flex;
  align-items: center;
  color: white;
  background: ${(props: ThemedDivProps) => props.theme.colors.label.success};
  padding: 2px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-right: 7px;
`
const TickMarkContainer = styled.div`
  display: flex;
  padding-right: 3px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-left: 7px;
  }
`
const initials = (name: BibliographicName): string =>
  name.given
    ? name.given
        .split(' ')
        .map(part => part.substr(0, 1).toUpperCase() + '.')
        .join('')
    : ''

interface Props {
  deleteProject: (project: Project) => () => Promise<string>
  projects: Project[]
  saveProjectTitle: (project: Project) => (title: string) => Promise<Project>
  collaborators: Map<string, UserProfileWithAvatar>
  user: UserProfileWithAvatar
  closeModal?: () => void
  acceptedInvitations: string[]
}

export const ProjectsList: React.FunctionComponent<Props> = ({
  closeModal,
  collaborators,
  deleteProject,
  projects,
  saveProjectTitle,
  user,
  acceptedInvitations,
}) => (
  <div>
    {projects.sort(projectListCompare).map(project => (
      <SidebarProject key={project._id}>
        <SidebarProjectHeader>
          <ProjectTitle to={`/projects/${project._id}`} onClick={closeModal}>
            {project.title ? (
              <Title value={project.title} />
            ) : (
              <PlaceholderTitle value={'Untitled Project'} />
            )}
          </ProjectTitle>
          {acceptedInvitations.includes(project._id) && (
            <AcceptedLabel>
              <TickMarkContainer>
                <TickMark />
              </TickMarkContainer>
              Accepted
            </AcceptedLabel>
          )}
          <Container>
            <Edit>
              <ProjectContextMenuButton
                project={project}
                deleteProject={deleteProject(project)}
                saveProjectTitle={saveProjectTitle(project)}
                closeModal={closeModal}
              />
            </Edit>
            <ShareProjectButton project={project} user={user} />
          </Container>
        </SidebarProjectHeader>

        <ProjectContributors>
          {buildCollaborators(project, collaborators).map(
            (collaborator, index) => (
              <React.Fragment key={collaborator._id}>
                {!!index && ', '}
                <ProjectContributor key={collaborator._id}>
                  {initials(collaborator.bibliographicName)}{' '}
                  {collaborator.bibliographicName.family}
                </ProjectContributor>
              </React.Fragment>
            )
          )}
        </ProjectContributors>
      </SidebarProject>
    ))}
  </div>
)
