import React from 'react'
import ProjectContributors from '../icons/project-contributors'
import ProjectEdit from '../icons/project-edit'
import ProjectLibrary from '../icons/project-library'
import { GlobalStyle, styled, ThemedProps } from '../theme'
import MenuBar from './MenuBar'
import ProjectLink from './ProjectLink'

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
  padding-top: 24px;
`

interface Props {
  projectID?: string
}

export const Page: React.SFC<Props> = ({ children, projectID }) => (
  <PageContainer>
    <GlobalStyle />

    {projectID && (
      <ViewsBar>
        <MenuBar projectID={projectID} />
        <IconBar>
          <ProjectLink
            to={`/projects/${projectID}`}
            isActive={(match, location) =>
              /^\/projects\/.+?\/manuscripts\/.+/.test(location.pathname)
            }
            title={'Edit'}
          >
            <ProjectEdit />
          </ProjectLink>

          <ProjectLink
            title={'Collaborators'}
            to={`/projects/${projectID}/collaborators`}
            exact={true}
          >
            <ProjectContributors />
          </ProjectLink>

          <ProjectLink
            title={'Library'}
            to={`/projects/${projectID}/library`}
            exact={true}
          >
            <ProjectLibrary />
          </ProjectLink>
        </IconBar>
      </ViewsBar>
    )}

    {children}
  </PageContainer>
)
