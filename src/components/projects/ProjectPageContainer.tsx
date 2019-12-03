/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import React from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import config from '../../config'
import CollaboratorsData from '../../data/CollaboratorsData'
import ContainerInvitationsData from '../../data/ContainerInvitationsData'
import GlobalLibrariesData from '../../data/GlobalLibrariesData'
import GlobalLibraryCollectionsData from '../../data/GlobalLibraryCollectionsData'
import GlobalLibraryItemsData from '../../data/GlobalLibraryItemsData'
import ManuscriptCommentsData from '../../data/ManuscriptCommentsData'
import ManuscriptData from '../../data/ManuscriptData'
import ProjectData from '../../data/ProjectData'
import ProjectInvitationsData from '../../data/ProjectInvitationsData'
import ProjectKeywordsData from '../../data/ProjectKeywordsData'
import ProjectLibraryCollectionsData from '../../data/ProjectLibraryCollectionsData'
import ProjectLibraryData from '../../data/ProjectLibraryData'
import ProjectManuscriptsData from '../../data/ProjectManuscriptsData'
import ProjectModelsData from '../../data/ProjectModelsData'
import ProjectsData from '../../data/ProjectsData'
import { TokenActions } from '../../data/TokenData'
import UserData from '../../data/UserData'
import UserProjectsData from '../../data/UserProjectsData'
import { buildCollaboratorProfiles } from '../../lib/collaborators'
import { buildContainerInvitations } from '../../lib/invitation'
import { getCurrentUserId } from '../../lib/user'
import { lastOpenedManuscriptID } from '../../lib/user-project'
import Sync from '../../sync/Sync'
import AddCollaboratorsPageContainer from '../collaboration/AddCollaboratorsPageContainer'
import CollaboratorsPageContainer from '../collaboration/CollaboratorsPageContainer'
import { DatabaseContext } from '../DatabaseProvider'
import { LibraryPageContainerProps } from '../library/LibraryPageContainer'
import { Page } from '../Page'
import {
  ProjectAphorismPlaceholder,
  ProjectPlaceholder,
  ProjectSyncingPlaceholder,
} from '../Placeholders'
import EmptyProjectPageContainer from './EmptyProjectPageContainer'
import { ManuscriptPageContainerProps } from './ManuscriptPageContainer'
import { ProjectDiagnosticsPageContainer } from './ProjectDiagnosticsPageContainer'

const LibraryPageContainer = React.lazy<
  React.ComponentType<LibraryPageContainerProps>
>(() =>
  import(
    /* webpackChunkName:"library-page" */ '../library/LibraryPageContainer'
  )
)

const ManuscriptPageContainer = React.lazy<
  React.ComponentType<ManuscriptPageContainerProps>
>(() =>
  import(/* webpackChunkName:"manuscript-page" */ './ManuscriptPageContainer')
)

const APHORISM_DURATION =
  Number(window.localStorage.getItem('aphorism-duration')) || 3000

interface Props {
  tokenActions: TokenActions
}

type CombinedProps = Props &
  RouteComponentProps<{
    projectID: string
  }>
class ProjectPageContainer extends React.Component<CombinedProps> {
  public render() {
    const {
      match: {
        params: { projectID },
      },
      tokenActions,
    } = this.props

    const message = this.props.location.state
      ? this.props.location.state.infoMessage
      : null

    return (
      <>
        <ProjectAphorismPlaceholder
          duration={APHORISM_DURATION}
          key={projectID}
        />

        <DatabaseContext.Consumer>
          {db => (
            <ProjectData
              projectID={projectID}
              placeholder={<ProjectPlaceholder />}
            >
              {project => (
                <Page project={project} tokenActions={tokenActions}>
                  <UserData userID={getCurrentUserId()!}>
                    {user => (
                      <CollaboratorsData placeholder={<ProjectPlaceholder />}>
                        {collaborators => (
                          <Sync
                            collection={`project-${projectID}`}
                            channels={[
                              `${projectID}-read`,
                              `${projectID}-readwrite`,
                            ]}
                            db={db}
                            tokenActions={tokenActions}
                          >
                            <GlobalLibraryCollectionsData>
                              {globalLibraryCollections => (
                                <GlobalLibrariesData>
                                  {globalLibraries => {
                                    const channels = [
                                      ...globalLibraries.keys(),
                                      ...globalLibraryCollections.keys(),
                                    ].map(id => `${id}-read`)

                                    return (
                                      <Sync
                                        collection={'libraryitems'}
                                        channels={channels}
                                        db={db}
                                        tokenActions={tokenActions}
                                        // readOnly={true}
                                      >
                                        <GlobalLibraryItemsData
                                          placeholder={<ProjectPlaceholder />}
                                        >
                                          {globalLibraryItems => (
                                            <UserProjectsData
                                              projectID={projectID}
                                            >
                                              {(
                                                userProjects,
                                                userProjectCollection
                                              ) => (
                                                <ProjectLibraryData
                                                  projectID={projectID}
                                                  placeholder={
                                                    <ProjectSyncingPlaceholder />
                                                  }
                                                >
                                                  {(
                                                    library,
                                                    libraryCollection
                                                  ) => (
                                                    <Switch>
                                                      <Route
                                                        path={
                                                          '/projects/:projectID/'
                                                        }
                                                        exact={true}
                                                        render={props => (
                                                          <ProjectManuscriptsData
                                                            projectID={
                                                              projectID
                                                            }
                                                            {...props}
                                                          >
                                                            {manuscripts => {
                                                              if (
                                                                !manuscripts.length ||
                                                                (props.location
                                                                  .state &&
                                                                  props.location
                                                                    .state
                                                                    .empty)
                                                              ) {
                                                                return (
                                                                  <EmptyProjectPageContainer
                                                                    project={
                                                                      project
                                                                    }
                                                                    user={user}
                                                                    message={
                                                                      message
                                                                    }
                                                                  />
                                                                )
                                                              }

                                                              const manuscriptID = lastOpenedManuscriptID(
                                                                projectID,
                                                                userProjects
                                                              )

                                                              if (
                                                                manuscriptID
                                                              ) {
                                                                return (
                                                                  <Redirect
                                                                    to={{
                                                                      pathname: `/projects/${project._id}/manuscripts/${manuscriptID}`,
                                                                      state: {
                                                                        infoMessage: message,
                                                                      },
                                                                    }}
                                                                  />
                                                                )
                                                              }

                                                              manuscripts.sort(
                                                                (a, b) =>
                                                                  Number(
                                                                    a.createdAt
                                                                  ) -
                                                                  Number(
                                                                    b.createdAt
                                                                  )
                                                              )

                                                              return (
                                                                <Redirect
                                                                  to={{
                                                                    pathname: `/projects/${project._id}/manuscripts/${manuscripts[0]._id}`,
                                                                    state: {
                                                                      infoMessage: message,
                                                                    },
                                                                  }}
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
                                                              {(
                                                                projects,
                                                                projectsCollection
                                                              ) => (
                                                                <ProjectKeywordsData
                                                                  projectID={
                                                                    projectID
                                                                  }
                                                                >
                                                                  {keywords => (
                                                                    <ProjectManuscriptsData
                                                                      projectID={
                                                                        projectID
                                                                      }
                                                                      {...props}
                                                                    >
                                                                      {manuscripts => (
                                                                        <ManuscriptData
                                                                          projectID={
                                                                            projectID
                                                                          }
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
                                                                                    user={
                                                                                      user
                                                                                    }
                                                                                    collaborators={buildCollaboratorProfiles(
                                                                                      collaborators,
                                                                                      user
                                                                                    )}
                                                                                    collaboratorsById={buildCollaboratorProfiles(
                                                                                      collaborators,
                                                                                      user,
                                                                                      '_id'
                                                                                    )}
                                                                                    userProjects={
                                                                                      userProjects
                                                                                    }
                                                                                    userProjectsCollection={
                                                                                      userProjectCollection
                                                                                    }
                                                                                    tokenActions={
                                                                                      this
                                                                                        .props
                                                                                        .tokenActions
                                                                                    }
                                                                                  />
                                                                                </React.Suspense>
                                                                              )}
                                                                            </ManuscriptCommentsData>
                                                                          )}
                                                                        </ManuscriptData>
                                                                      )}
                                                                    </ProjectManuscriptsData>
                                                                  )}
                                                                </ProjectKeywordsData>
                                                              )}
                                                            </ProjectsData>
                                                          )
                                                        }}
                                                      />

                                                      <Route
                                                        path={
                                                          '/projects/:projectID/library/:sourceType?/:sourceID?/:filterID?'
                                                        }
                                                        render={props => (
                                                          <ProjectLibraryCollectionsData
                                                            projectID={
                                                              projectID
                                                            }
                                                          >
                                                            {(
                                                              projectLibraryCollections,
                                                              projectLibraryCollectionsCollection
                                                            ) => (
                                                              <React.Suspense
                                                                fallback={
                                                                  <ProjectPlaceholder />
                                                                }
                                                              >
                                                                <LibraryPageContainer
                                                                  {...props}
                                                                  project={
                                                                    project
                                                                  }
                                                                  projectLibrary={
                                                                    library
                                                                  }
                                                                  projectLibraryCollection={
                                                                    libraryCollection
                                                                  }
                                                                  projectLibraryCollections={
                                                                    projectLibraryCollections
                                                                  }
                                                                  projectLibraryCollectionsCollection={
                                                                    projectLibraryCollectionsCollection
                                                                  }
                                                                  globalLibraries={
                                                                    globalLibraries
                                                                  }
                                                                  globalLibraryCollections={
                                                                    globalLibraryCollections
                                                                  }
                                                                  globalLibraryItems={
                                                                    globalLibraryItems
                                                                  }
                                                                  user={user}
                                                                />
                                                              </React.Suspense>
                                                            )}
                                                          </ProjectLibraryCollectionsData>
                                                        )}
                                                      />

                                                      {config.local || (
                                                        <React.Fragment>
                                                          <Route
                                                            path={
                                                              '/projects/:projectID/collaborators'
                                                            }
                                                            exact={true}
                                                            render={props => (
                                                              <ProjectInvitationsData
                                                                projectID={
                                                                  projectID
                                                                }
                                                                {...props}
                                                              >
                                                                {invitations => (
                                                                  <ContainerInvitationsData
                                                                    containerID={
                                                                      projectID
                                                                    }
                                                                    {...props}
                                                                  >
                                                                    {containerInvitations => (
                                                                      <CollaboratorsPageContainer
                                                                        {...props}
                                                                        invitations={[
                                                                          ...buildContainerInvitations(
                                                                            invitations
                                                                          ),
                                                                          ...containerInvitations,
                                                                        ].filter(
                                                                          invitation =>
                                                                            invitation.containerID.startsWith(
                                                                              'MPProject'
                                                                            )
                                                                        )}
                                                                        project={
                                                                          project
                                                                        }
                                                                        user={
                                                                          user
                                                                        }
                                                                        collaborators={buildCollaboratorProfiles(
                                                                          collaborators,
                                                                          user
                                                                        )}
                                                                        tokenActions={
                                                                          this
                                                                            .props
                                                                            .tokenActions
                                                                        }
                                                                      />
                                                                    )}
                                                                  </ContainerInvitationsData>
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
                                                                projectID={
                                                                  projectID
                                                                }
                                                                {...props}
                                                              >
                                                                {invitations => (
                                                                  <ContainerInvitationsData
                                                                    containerID={
                                                                      projectID
                                                                    }
                                                                    {...props}
                                                                  >
                                                                    {containerInvitations => (
                                                                      <ProjectsData>
                                                                        {projects => (
                                                                          <AddCollaboratorsPageContainer
                                                                            {...props}
                                                                            invitations={[
                                                                              ...buildContainerInvitations(
                                                                                invitations
                                                                              ),
                                                                              ...containerInvitations,
                                                                            ].filter(
                                                                              invitation =>
                                                                                invitation.containerID.startsWith(
                                                                                  'MPProject'
                                                                                )
                                                                            )}
                                                                            project={
                                                                              project
                                                                            }
                                                                            projects={
                                                                              projects
                                                                            }
                                                                            user={
                                                                              user
                                                                            }
                                                                            collaborators={buildCollaboratorProfiles(
                                                                              collaborators,
                                                                              user
                                                                            )}
                                                                            tokenActions={
                                                                              this
                                                                                .props
                                                                                .tokenActions
                                                                            }
                                                                          />
                                                                        )}
                                                                      </ProjectsData>
                                                                    )}
                                                                  </ContainerInvitationsData>
                                                                )}
                                                              </ProjectInvitationsData>
                                                            )}
                                                          />
                                                        </React.Fragment>
                                                      )}

                                                      <Route
                                                        path={
                                                          '/projects/:projectID/diagnostics'
                                                        }
                                                        exact={true}
                                                        render={() => (
                                                          <ProjectModelsData
                                                            projectID={
                                                              projectID
                                                            }
                                                          >
                                                            {data => (
                                                              <ProjectDiagnosticsPageContainer
                                                                data={data}
                                                                projectID={
                                                                  projectID
                                                                }
                                                              />
                                                            )}
                                                          </ProjectModelsData>
                                                        )}
                                                      />
                                                    </Switch>
                                                  )}
                                                </ProjectLibraryData>
                                              )}
                                            </UserProjectsData>
                                          )}
                                        </GlobalLibraryItemsData>
                                      </Sync>
                                    )
                                  }}
                                </GlobalLibrariesData>
                              )}
                            </GlobalLibraryCollectionsData>
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
      </>
    )
  }
}

export default ProjectPageContainer
