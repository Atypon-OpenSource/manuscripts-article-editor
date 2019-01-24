import AddIcon from '@manuscripts/assets/react/AddIcon'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import CollaboratorsData from '../../data/CollaboratorsData'
import ProjectsData from '../../data/ProjectsData'
import UserData from '../../data/UserData'
import { getCurrentUserId } from '../../lib/user'
import { styled, ThemedProps } from '../../theme'
import { ModalProps, withModal } from '../ModalProvider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../Sidebar'
import TemplateSelector from '../templates/TemplateSelector'
import { ProjectsList } from './ProjectsList'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const Container = styled(Sidebar)`
  background: white;
`

const Header = styled(SidebarHeader)`
  @media (max-width: 450px) {
    margin-left: 7px;
  }
`

const SidebarActionTitle = styled.span`
  display: flex;
  align-items: center;
  padding-left: 11px;
  padding-bottom: 2px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.2px;
  color: ${(props: ThemedDivProps) => props.theme.colors.sidebar.text.primary};
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

const openTemplateSelector = (
  props: ModalProps,
  user: UserProfileWithAvatar
) => () => {
  props.addModal('template-selector', ({ handleClose }) => (
    <TemplateSelector user={user} handleComplete={handleClose} />
  ))
}

interface Props {
  closeModal?: () => void
}

const ProjectsSidebar: React.FunctionComponent<ModalProps & Props> = props => (
  <Container id={'projects-sidebar'}>
    <UserData userID={getCurrentUserId()!}>
      {user => (
        <ProjectsContainer>
          <Header>
            <SidebarTitle className={'sidebar-title'}>Projects</SidebarTitle>
          </Header>
          <SidebarAction>
            <AddButton
              onClick={openTemplateSelector(props, user)}
              id={'create-project'}
            >
              <AddIcon />
              <SidebarActionTitle>New Project</SidebarActionTitle>
            </AddButton>
          </SidebarAction>
          <SidebarContent>
            <ProjectsData>
              {(projects, projectsCollection) => (
                <CollaboratorsData>
                  {collaborators => (
                    <ProjectsList
                      projects={projects}
                      deleteProject={(project: Project) => () =>
                        projectsCollection.delete(project._id)}
                      saveProjectTitle={(project: Project) => (title: string) =>
                        projectsCollection.update(project._id, { title })}
                      collaborators={collaborators}
                      user={user}
                      closeModal={props.closeModal}
                    />
                  )}
                </CollaboratorsData>
              )}
            </ProjectsData>
          </SidebarContent>
        </ProjectsContainer>
      )}
    </UserData>
  </Container>
)

export default withModal<Props>(ProjectsSidebar)
