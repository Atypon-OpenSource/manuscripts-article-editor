import {
  BibliographicName,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { dustyGrey } from '../../colors'
import Add from '../../icons/add'
import { styled } from '../../theme'
import ShareProjectButton from '../collaboration/ShareProjectButton'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../Sidebar'
import { projectListCompare } from './ProjectsPageContainer'

const Container = styled(Sidebar)`
  background: white;
`

const Header = styled(SidebarHeader)`
  @media (max-width: 450px) {
    margin-left: 7px;
  }
`
const SidebarProject = styled.div`
  padding: 16px;
  margin: 0 -16px;
  border: 1px solid transparent;
  border-bottom-color: #eaecee;
  width: 500px;
  border-radius: 4px;

  &:hover {
    background-color: #f1f8ff;
    border-color: #edf2f5;
  }

  @media (max-width: 450px) {
    width: unset;
  }
`

const SidebarProjectHeader = styled.div`
  display: flex;
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

const SidebarActionTitle = styled.span`
  display: flex;
  align-items: center;
  padding-left: 11px;
  padding-bottom: 2px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.2px;
  color: #353535;
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover ${SidebarActionTitle} {
    color: #000;
  }

  &:focus {
    outline: none;
  }
`

const SidebarAction = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  @media (max-width: 450px) {
    margin-left: 17px;
  }
`

const ProjectsContainer = styled.div`
  padding: 20px 60px;

  @media (max-width: 450px) {
    padding: unset;
  }
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

const initials = (name: BibliographicName): string =>
  name.given
    ? name.given
        .split(' ')
        .map(part => part.substr(0, 1).toUpperCase() + '.')
        .join('')
    : ''

interface Props {
  addProject: React.MouseEventHandler<HTMLButtonElement>
  projects: Project[]
  getCollaborators: (project: Project) => UserProfile[]
}

const ProjectsSidebar: React.FunctionComponent<Props> = ({
  addProject,
  projects,
  getCollaborators,
}) => (
  <Container id={'projects-sidebar'}>
    <ProjectsContainer>
      <Header>
        <SidebarTitle className={'sidebar-title'}>Projects</SidebarTitle>
      </Header>
      <SidebarAction>
        <AddButton onClick={addProject} id={'create-project'}>
          <Add size={32} />
          <SidebarActionTitle>Add New Project</SidebarActionTitle>
        </AddButton>
      </SidebarAction>
      <SidebarContent>
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
              <ShareProjectButton project={project} />
            </SidebarProjectHeader>
            <ProjectContributors>
              {getCollaborators(project).map((collaborator, index) => (
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
      </SidebarContent>
    </ProjectsContainer>
  </Container>
)

export default ProjectsSidebar
