import React from 'react'
import { NavLink } from 'react-router-dom'
import ShareProjectButton from '../components/ShareProjectButton'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import Title from '../editor/title/Title'
import Add from '../icons/add'
import { styled } from '../theme'
import { BibliographicName } from '../types/components'
import { ProjectInfo } from './ProjectsPageContainer'

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
`

const SidebarProjectHeader = styled.div`
  display: flex;
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
`

const ProjectsContainer = styled.div`
  padding: 20px 60px;
`

const ProjectContributors = styled.div`
  font-size: 15px;
  margin-top: 8px;
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
  projects: ProjectInfo[]
}

const ProjectsSidebar: React.SFC<Props> = ({ addProject, projects }) => (
  <Sidebar id={'projects-sidebar'}>
    <ProjectsContainer>
      <SidebarHeader>
        <SidebarTitle className={'sidebar-title'}>Projects</SidebarTitle>
      </SidebarHeader>
      <SidebarAction>
        <AddButton onClick={addProject} id={'create-project'}>
          <Add size={32} />
          <SidebarActionTitle>Add New Project</SidebarActionTitle>
        </AddButton>
      </SidebarAction>
      <SidebarContent>
        {projects.map(project => (
          <SidebarProject key={project.id}>
            <SidebarProjectHeader>
              <ProjectTitle to={`/projects/${project.id}`}>
                <Title value={project.title || ''} />
              </ProjectTitle>
              <ShareProjectButton projectID={project.id!} />
            </SidebarProjectHeader>
            <ProjectContributors>
              {project.collaborators.map((collaborator, index) => (
                <React.Fragment key={collaborator.id}>
                  {!!index && ', '}
                  <ProjectContributor key={collaborator.id}>
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
  </Sidebar>
)

export default ProjectsSidebar
