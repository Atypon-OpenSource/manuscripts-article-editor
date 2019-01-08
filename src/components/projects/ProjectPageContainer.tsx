import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import ManuscriptCommentsData from '../../data/ManuscriptCommentsData'
import ManuscriptData from '../../data/ManuscriptData'
import ProjectData from '../../data/ProjectData'
import ProjectInvitationsData from '../../data/ProjectInvitationsData'
import ProjectKeywordsData from '../../data/ProjectKeywordsData'
import ProjectLibraryData from '../../data/ProjectLibraryData'
import ProjectManuscriptsData from '../../data/ProjectManuscriptsData'
import ProjectsData from '../../data/ProjectsData'
import UserData from '../../data/UserData'
import UsersData from '../../data/UsersData'
import { getCurrentUserId } from '../../lib/user'
import AddCollaboratorsPageContainer from '../collaboration/AddCollaboratorsPageContainer'
import CollaboratorsPageContainer from '../collaboration/CollaboratorsPageContainer'
import LibraryPageContainer from '../library/LibraryPageContainer'
import { Spinner } from '../Spinner'
import EmptyProjectPageContainer from './EmptyProjectPageContainer'
// import ManuscriptPageContainer from './ManuscriptPageContainer'

const ManuscriptPageContainer = React.lazy(() =>
  import(/* webpackChunkName:"manuscript" */ './ManuscriptPageContainer')
)

interface State {
  project: Project | null
  manuscripts: Manuscript[] | null
  error: string | null
}

class ProjectPageContainer extends React.Component<
  RouteComponentProps<{
    projectID: string
  }>,
  State
> {
  public render() {
    const { projectID } = this.props.match.params

    return (
      <UserData userID={getCurrentUserId()!}>
        {user => (
          <UsersData>
            {users => (
              <ProjectData projectID={projectID}>
                {project => (
                  <ProjectLibraryData projectID={projectID}>
                    {library => (
                      <Switch>
                        <Route path={'/projects/:projectID'} exact={true}>
                          <ProjectManuscriptsData projectID={projectID}>
                            {manuscripts => {
                              if (!manuscripts.length) {
                                return (
                                  <EmptyProjectPageContainer
                                    project={project}
                                    user={user}
                                  />
                                )
                              }

                              manuscripts.sort(
                                (a, b) =>
                                  Number(a.createdAt) - Number(b.createdAt)
                              )

                              return (
                                <Redirect
                                  to={`/projects/${project._id}/manuscripts/${
                                    manuscripts[0]._id
                                  }`}
                                />
                              )
                            }}
                          </ProjectManuscriptsData>
                        </Route>

                        <Route
                          path={
                            '/projects/:projectID/manuscripts/:manuscriptID'
                          }
                          exact={true}
                        >
                          {(
                            props: RouteComponentProps<{
                              manuscriptID: string
                              projectID: string
                            }>
                          ) => {
                            const {
                              manuscriptID,
                              projectID,
                            } = props.match.params

                            return (
                              <ProjectManuscriptsData projectID={projectID}>
                                {manuscripts => (
                                  <ProjectKeywordsData projectID={projectID}>
                                    {keywords => (
                                      <ManuscriptData
                                        manuscriptID={manuscriptID}
                                      >
                                        {manuscript => (
                                          <ManuscriptCommentsData
                                            manuscriptID={manuscriptID}
                                            projectID={projectID}
                                          >
                                            {comments => (
                                              <React.Suspense
                                                fallback={<Spinner />}
                                              >
                                                <ManuscriptPageContainer
                                                  {...props}
                                                  comments={comments}
                                                  keywords={keywords}
                                                  library={library}
                                                  manuscript={manuscript}
                                                  manuscripts={manuscripts}
                                                  project={project}
                                                  user={user}
                                                  users={users}
                                                />
                                              </React.Suspense>
                                            )}
                                          </ManuscriptCommentsData>
                                        )}
                                      </ManuscriptData>
                                    )}
                                  </ProjectKeywordsData>
                                )}
                              </ProjectManuscriptsData>
                            )
                          }}
                        </Route>

                        <Route
                          path={'/projects/:projectID/library'}
                          exact={true}
                        >
                          {props => (
                            <LibraryPageContainer
                              {...props}
                              project={project}
                              library={library}
                            />
                          )}
                        </Route>

                        <Route
                          path={'/projects/:projectID/collaborators'}
                          exact={true}
                        >
                          {props => (
                            <ProjectInvitationsData projectID={projectID}>
                              {invitations => (
                                <CollaboratorsPageContainer
                                  {...props}
                                  invitations={invitations}
                                  project={project}
                                  user={user}
                                  users={users}
                                />
                              )}
                            </ProjectInvitationsData>
                          )}
                        </Route>

                        <Route
                          path={'/projects/:projectID/collaborators/add'}
                          exact={true}
                        >
                          {props => (
                            <ProjectInvitationsData projectID={projectID}>
                              {invitations => (
                                <ProjectsData>
                                  {projects => (
                                    <AddCollaboratorsPageContainer
                                      {...props}
                                      invitations={invitations}
                                      project={project}
                                      projects={projects}
                                      user={user}
                                      users={users}
                                    />
                                  )}
                                </ProjectsData>
                              )}
                            </ProjectInvitationsData>
                          )}
                        </Route>
                      </Switch>
                    )}
                  </ProjectLibraryData>
                )}
              </ProjectData>
            )}
          </UsersData>
        )}
      </UserData>
    )
  }
}

export default ProjectPageContainer
