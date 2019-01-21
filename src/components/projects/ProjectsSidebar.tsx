import AddIcon from '@manuscripts/assets/react/AddIcon'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import ProjectsData from '../../data/ProjectsData'
import UserData from '../../data/UserData'
import UsersData from '../../data/UsersData'
import { getCurrentUserId } from '../../lib/user'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { styled, ThemedProps } from '../../theme'
import { ModalProps, withModal } from '../ModalProvider'
import ProjectsDropdownButton from '../nav/ProjectsDropdownButton'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../Sidebar'
import { TemplateSelector } from '../templates/TemplateSelector'
import { ProjectsList } from './ProjectsList'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const Container = styled(Sidebar)`
  background: white;
  width: fit-content;
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

type Props = ModelsProps & RouteComponentProps & ModalProps

const openTemplateSelector = (
  props: Props,
  user: UserProfileWithAvatar
) => () => {
  props.addModal('template-selector', ({ handleClose }) => (
    <TemplateSelector
      history={props.history}
      saveModel={props.models.saveModel}
      user={user}
      handleComplete={handleClose}
    />
  ))
}

const ProjectsSidebar: React.FunctionComponent<Props> = props => (
  <Container id={'projects-sidebar'}>
    <ProjectsContainer>
      <Header>
        <SidebarTitle className={'sidebar-title'}>Projects</SidebarTitle>
      </Header>
      <SidebarAction>
        <UserData userID={getCurrentUserId()!}>
          {user => (
            <AddButton
              onClick={openTemplateSelector(props, user)}
              id={'create-project'}
            >
              <AddIcon />
              <SidebarActionTitle>New Project</SidebarActionTitle>
            </AddButton>
          )}
        </UserData>
      </SidebarAction>
      <ProjectsDropdownButton renderInvitations={true} />
      <SidebarContent>
        <UsersData>
          {users => (
            <ProjectsData>
              {projects => <ProjectsList projects={projects} users={users} />}
            </ProjectsData>
          )}
        </UsersData>
      </SidebarContent>
    </ProjectsContainer>
  </Container>
)

export default withRouter(withModal(withModels(ProjectsSidebar)))
