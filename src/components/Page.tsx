import ContributorsIcon from '@manuscripts/assets/react/ContributorsIcon'
import EditProjectIcon from '@manuscripts/assets/react/EditProjectIcon'
import NavIconFillCut from '@manuscripts/assets/react/NavIconFillCut'
import NavIconOutline from '@manuscripts/assets/react/NavIconOutline'
import ReferenceLibraryIcon from '@manuscripts/assets/react/ReferenceLibraryIcon'
import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import { styled, ThemedProps } from '../theme'
import MenuBar from './nav/MenuBar'
import ProjectNavigator from './ProjectNavigator'
import { Tip } from './Tip'

type ThemedDivProps = ThemedProps<HTMLDivElement>

export const Main = styled.main`
  height: 100vh;
  flex: 1;
  position: relative;
  box-sizing: border-box;
`

export const Centered = styled(Main)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  color: ${(props: ThemedDivProps) => props.theme.colors.global.text.primary};
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
`

const ViewsBar = styled.div`
  height: 100vh;
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.iconBar.background.default};
`

const IconBar = styled.div`
  flex: 1;
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.iconBar.background.default};
`

const ViewLink = styled(NavLink)`
  margin: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  background: none;
  color: white;

  &:hover,
  &.active {
    background: ${(props: ThemedDivProps) =>
      props.theme.colors.iconBar.background.selected};
    color: ${(props: ThemedDivProps) =>
      props.theme.colors.iconBar.background.default};
  }
`

const NavIcon = styled(NavIconOutline)`
  display: block;
`

const NavIconHover = styled(NavIconFillCut)`
  display: none;
`

const NavIconContainer = styled.div`
  &:hover ${NavIcon} {
    display: none;
  }

  &:hover ${NavIconHover} {
    display: block;
  }
`

const ViewsSeparator = styled.div`
  height: 2px;
  border-radius: 2px;
  width: 30px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
`

const StyledEditProjectIcon = styled(EditProjectIcon)`
  g {
    stroke: currentColor;
  }
`

const ProjectLibraryIcon = styled(ReferenceLibraryIcon)`
  path {
    stroke: currentColor;
  }
`

const ProjectContributorsIcon = styled(ContributorsIcon)`
  path {
    stroke: currentColor;
  }

  circle {
    stroke: currentColor;
  }
`

interface Props {
  project?: Project
}

export const Page: React.FunctionComponent<Props> = ({ children, project }) => (
  <PageContainer>
    <Helmet>
      {project ? (
        <title>Manuscripts.io: {project.title || 'Untitled Project'}</title>
      ) : (
        <title>Manuscripts.io</title>
      )}
    </Helmet>

    {project && (
      <ViewsBar>
        <ProjectNavigator />

        <MenuBar projectID={project._id}>
          <Tip title={'Home'} placement={'right'}>
            <NavIconContainer>
              <NavIcon />
              <NavIconHover />
            </NavIconContainer>
          </Tip>
        </MenuBar>

        <ViewsSeparator />

        <IconBar>
          <Tip title={'Edit ⌥⌘3'} placement={'right'}>
            <ViewLink
              to={`/projects/${project._id}`}
              isActive={(match, location) =>
                /^\/projects\/.+?\/manuscripts\/.+/.test(location.pathname)
              }
            >
              <StyledEditProjectIcon />
            </ViewLink>
          </Tip>

          <Tip title={'Library ⌥⌘4'} placement={'right'}>
            <ViewLink to={`/projects/${project._id}/library`} exact={true}>
              <ProjectLibraryIcon />
            </ViewLink>
          </Tip>

          <Tip title={'Collaborators ⌥⌘5'} placement={'right'}>
            <ViewLink
              to={`/projects/${project._id}/collaborators`}
              exact={true}
            >
              <ProjectContributorsIcon />
            </ViewLink>
          </Tip>
        </IconBar>
      </ViewsBar>
    )}

    {children}
  </PageContainer>
)
