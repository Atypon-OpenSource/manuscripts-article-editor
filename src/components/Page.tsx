import NavIconFillCut from '@manuscripts/assets/react/NavIconFillCut'
import NavIconOutline from '@manuscripts/assets/react/NavIconOutline'
import React from 'react'
import { Helmet } from 'react-helmet'
import ProjectContributors from '../icons/project-contributors'
import ProjectEdit from '../icons/project-edit'
import ProjectLibrary from '../icons/project-library'
import { GlobalStyle, styled, ThemedProps } from '../theme'
import { Project } from '../types/components'
import MenuBar from './MenuBar'
import { Tip } from './Tip'
import { ViewLink } from './ViewLink'

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
  color: ${(props: ThemedDivProps) => props.theme.colors.primary.black};
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
`

const ViewsBar = styled.div`
  height: 100vh;
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.primary.blue};
`

const IconBar = styled.div`
  flex: 1;
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.primary.blue};
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

interface Props {
  project?: Project
}

export const Page: React.SFC<Props> = ({ children, project }) => (
  <PageContainer>
    <GlobalStyle />

    <Helmet>
      {project ? (
        <title>Manuscripts.io: {project.title || 'Untitled Project'}</title>
      ) : (
        <title>Manuscripts.io</title>
      )}
    </Helmet>

    {project && (
      <ViewsBar>
        <MenuBar projectID={project.id}>
          <Tip title={'Home'} placement={'right'}>
            <NavIconContainer>
              <NavIcon />
              <NavIconHover />
            </NavIconContainer>
          </Tip>
        </MenuBar>

        <ViewsSeparator />

        <IconBar>
          <Tip title={'Edit'} placement={'right'}>
            <ViewLink
              to={`/projects/${project.id}`}
              isActive={(match, location) =>
                /^\/projects\/.+?\/manuscripts\/.+/.test(location.pathname)
              }
            >
              <ProjectEdit />
            </ViewLink>
          </Tip>

          <Tip title={'Library'} placement={'right'}>
            <ViewLink to={`/projects/${project.id}/library`} exact={true}>
              <ProjectLibrary />
            </ViewLink>
          </Tip>

          <Tip title={'Collaborators'} placement={'right'}>
            <ViewLink to={`/projects/${project.id}/collaborators`} exact={true}>
              <ProjectContributors />
            </ViewLink>
          </Tip>
        </IconBar>
      </ViewsBar>
    )}

    {children}
  </PageContainer>
)
