import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import ProjectsData from '../../data/ProjectsData'
import UserData from '../../data/UserData'
import UsersData from '../../data/UsersData'
import Add from '../../icons/add'
import { getCurrentUserId } from '../../lib/user'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { styled } from '../../theme'
import { ModalProps, withModal } from '../ModalProvider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../Sidebar'
import { TemplateSelector } from '../templates/TemplateSelector'
import { ProjectsList } from './ProjectsList'

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
              <Add size={32} />
              <SidebarActionTitle>Add New Project</SidebarActionTitle>
            </AddButton>
          )}
        </UserData>
      </SidebarAction>
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
