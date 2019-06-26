/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import CollaboratorsData from '../../data/CollaboratorsData'
import ManuscriptCommentsData from '../../data/ManuscriptCommentsData'
import ManuscriptData from '../../data/ManuscriptData'
import ProjectData from '../../data/ProjectData'
import ProjectInvitationsData from '../../data/ProjectInvitationsData'
import ProjectKeywordsData from '../../data/ProjectKeywordsData'
import ProjectLibraryData from '../../data/ProjectLibraryData'
import ProjectManuscriptsData from '../../data/ProjectManuscriptsData'
import ProjectsData from '../../data/ProjectsData'
import { TokenActions } from '../../data/TokenData'
import UserData from '../../data/UserData'
import UserProjectsData from '../../data/UserProjectsData'
import { buildCollaboratorProfiles } from '../../lib/collaborators'
import { getCurrentUserId } from '../../lib/user'
import { lastOpenedManuscriptID } from '../../lib/user-project'
import Sync from '../../sync/Sync'
import AddCollaboratorsPageContainer from '../collaboration/AddCollaboratorsPageContainer'
import CollaboratorsPageContainer from '../collaboration/CollaboratorsPageContainer'
import { DatabaseContext } from '../DatabaseProvider'
import { LibraryPageContainerComponent } from '../library/LibraryPageContainer'
import { Page } from '../Page'
import { ProjectPlaceholder } from '../Placeholders'
import EmptyProjectPageContainer from './EmptyProjectPageContainer'
import { ManuscriptPageContainerComponent } from './ManuscriptPageContainer'

const LibraryPageContainer = React.lazy<LibraryPageContainerComponent>(() =>
  import(
    /* webpackChunkName:"library-page" */ '../library/LibraryPageContainer'
  )
)

const ManuscriptPageContainer = React.lazy<ManuscriptPageContainerComponent>(
  () =>
    import(/* webpackChunkName:"manuscript-page" */ './ManuscriptPageContainer')
)

interface State {
  project: Project | null
  manuscripts: Manuscript[] | null
  error: string | null
}

interface Props {
  tokenActions: TokenActions
}

type CombinedProps = Props &
  RouteComponentProps<{
    projectID: string
  }>
class ProjectPageContainer extends React.Component<CombinedProps, State> {
  public render() {
    const {
      match: {
        params: { projectID },
      },
    } = this.props

    return (
      <DatabaseContext.Consumer>
        {db => (
          <ProjectData projectID={projectID}>
            {project => (
              <Page project={project} tokenActions={this.props.tokenActions}>
                <UserData userID={getCurrentUserId()!}>
                  {user => (
                    <CollaboratorsData>
                      {collaborators => (
                        <Sync
                          collection={`project-${projectID}`}
                          channels={[
                            `${projectID}-read`,
                            `${projectID}-readwrite`,
                          ]}
                          db={db}
                        >
                          <UserProjectsData projectID={projectID}>
                            {(userProjects, userProjectCollection) => (
                              <ProjectLibraryData projectID={projectID}>
                                {(library, libraryCollection) => (
                                  <Switch>
                                    <Route
                                      path={'/projects/:projectID/'}
                                      exact={true}
                                      render={props => (
                                        <ProjectManuscriptsData
                                          projectID={projectID}
                                          {...props}
                                        >
                                          {manuscripts => {
                                            if (
                                              !manuscripts.length ||
                                              (props.location.state &&
                                                props.location.state.empty)
                                            ) {
                                              return (
                                                <EmptyProjectPageContainer
                                                  project={project}
                                                  user={user}
                                                />
                                              )
                                            }

                                            const manuscriptID = lastOpenedManuscriptID(
                                              projectID,
                                              userProjects
                                            )

                                            if (manuscriptID) {
                                              return (
                                                <Redirect
                                                  to={`/projects/${project._id}/manuscripts/${manuscriptID}`}
                                                />
                                              )
                                            }

                                            manuscripts.sort(
                                              (a, b) =>
                                                Number(a.createdAt) -
                                                Number(b.createdAt)
                                            )

                                            return (
                                              <Redirect
                                                to={`/projects/${project._id}/manuscripts/${manuscripts[0]._id}`}
                                              />
                                            )
                                          }}
                                        </ProjectManuscriptsData>
                                      )}
                                    />

                                    <Route
                                      path={
                                        '/projects/:projectID/manuscripts/:manuscriptID'
                                      }
                                      exact={true}
                                      render={(
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
                                          <ProjectsData>
                                            {(projects, projectsCollection) => (
                                              <ProjectManuscriptsData
                                                projectID={projectID}
                                                {...props}
                                              >
                                                {manuscripts => (
                                                  <ProjectKeywordsData
                                                    projectID={projectID}
                                                  >
                                                    {keywords => (
                                                      <ManuscriptData
                                                        projectID={projectID}
                                                        manuscriptID={
                                                          manuscriptID
                                                        }
                                                      >
                                                        {manuscript => (
                                                          <ManuscriptCommentsData
                                                            manuscriptID={
                                                              manuscriptID
                                                            }
                                                            projectID={
                                                              projectID
                                                            }
                                                          >
                                                            {comments => (
                                                              <React.Suspense
                                                                fallback={
                                                                  <ProjectPlaceholder />
                                                                }
                                                              >
                                                                <ManuscriptPageContainer
                                                                  {...props}
                                                                  comments={
                                                                    comments
                                                                  }
                                                                  keywords={
                                                                    keywords
                                                                  }
                                                                  library={
                                                                    library
                                                                  }
                                                                  manuscript={
                                                                    manuscript
                                                                  }
                                                                  manuscripts={
                                                                    manuscripts
                                                                  }
                                                                  project={
                                                                    project
                                                                  }
                                                                  projects={
                                                                    projects
                                                                  }
                                                                  projectsCollection={
                                                                    projectsCollection
                                                                  }
                                                                  user={user}
                                                                  collaborators={buildCollaboratorProfiles(
                                                                    collaborators,
                                                                    user
                                                                  )}
                                                                  userProjects={
                                                                    userProjects
                                                                  }
                                                                  userProjectsCollection={
                                                                    userProjectCollection
                                                                  }
                                                                  tokenActions={
                                                                    this.props
                                                                      .tokenActions
                                                                  }
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
                                            )}
                                          </ProjectsData>
                                        )
                                      }}
                                    />

                                    <Route
                                      path={'/projects/:projectID/library'}
                                      exact={false}
                                      render={props => (
                                        <React.Suspense
                                          fallback={<ProjectPlaceholder />}
                                        >
                                          <LibraryPageContainer
                                            {...props}
                                            project={project}
                                            library={library}
                                            libraryCollection={
                                              libraryCollection
                                            }
                                          />
                                        </React.Suspense>
                                      )}
                                    />

                                    <Route
                                      path={
                                        '/projects/:projectID/collaborators'
                                      }
                                      exact={true}
                                      render={props => (
                                        <ProjectInvitationsData
                                          projectID={projectID}
                                          {...props}
                                        >
                                          {invitations => (
                                            <CollaboratorsPageContainer
                                              {...props}
                                              invitations={invitations}
                                              project={project}
                                              user={user}
                                              collaborators={buildCollaboratorProfiles(
                                                collaborators,
                                                user
                                              )}
                                              tokenActions={
                                                this.props.tokenActions
                                              }
                                            />
                                          )}
                                        </ProjectInvitationsData>
                                      )}
                                    />

                                    <Route
                                      path={
                                        '/projects/:projectID/collaborators/add'
                                      }
                                      exact={true}
                                      render={props => (
                                        <ProjectInvitationsData
                                          projectID={projectID}
                                          {...props}
                                        >
                                          {invitations => (
                                            <ProjectsData>
                                              {projects => (
                                                <AddCollaboratorsPageContainer
                                                  {...props}
                                                  invitations={invitations}
                                                  project={project}
                                                  projects={projects}
                                                  user={user}
                                                  collaborators={buildCollaboratorProfiles(
                                                    collaborators,
                                                    user
                                                  )}
                                                  tokenActions={
                                                    this.props.tokenActions
                                                  }
                                                />
                                              )}
                                            </ProjectsData>
                                          )}
                                        </ProjectInvitationsData>
                                      )}
                                    />
                                  </Switch>
                                )}
                              </ProjectLibraryData>
                            )}
                          </UserProjectsData>
                        </Sync>
                      )}
                    </CollaboratorsData>
                  )}
                </UserData>
              </Page>
            )}
          </ProjectData>
        )}
      </DatabaseContext.Consumer>
    )
  }
}

export default ProjectPageContainer
