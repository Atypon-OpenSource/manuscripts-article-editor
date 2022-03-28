"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Manuscript } from '@manuscripts/manuscripts-json-schema'
// import React from 'react'
// import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
// import config from '../../config'
// import ContainerInvitationsData from '../../data/ContainerInvitationsData'
// import ManuscriptCommentsData from '../../data/ManuscriptCommentsData'
// import ManuscriptData from '../../data/ManuscriptData'
// import ManuscriptNoteData from '../../data/ManuscriptNoteData'
// import ProjectInvitationsData from '../../data/ProjectInvitationsData'
// import ProjectKeywordsData from '../../data/ProjectKeywordsData'
// import ProjectLibraryCollectionsData from '../../data/ProjectLibraryCollectionsData'
// import ProjectModelsData from '../../data/ProjectModelsData'
// import ProjectsData from '../../data/ProjectsData'
// import ProjectTagsData from '../../data/ProjectTagsData'
// import { TokenActions } from '../../data/TokenData'
// import { buildInvitations } from '../../lib/invitation'
// import { lastOpenedManuscriptID } from '../../lib/user-project'
// import { Collection } from '../../sync/Collection'
// import AddCollaboratorsPageContainer from '../collaboration/AddCollaboratorsPageContainer'
// import CollaboratorsPageContainer from '../collaboration/CollaboratorsPageContainer'
// import { HistoricalView } from '../history/HistoricalView'
// import { LibraryPageContainerProps } from '../library/LibraryPageContainer'
// import { Page } from '../Page'
// import { ProjectAphorismPlaceholder, ProjectPlaceholder } from '../Placeholders'
// import EmptyProjectPageContainer from './EmptyProjectPageContainer'
// import { ManuscriptPageContainerProps } from './ManuscriptPageContainer'
// import { ProjectDiagnosticsPageContainer } from './ProjectDiagnosticsPageContainer'
// const LibraryPageContainer = React.lazy<
//   React.ComponentType<LibraryPageContainerProps>
// >(
//   () =>
//     import(
//       /* webpackChunkName:"library-page" */ '../library/LibraryPageContainer'
//     )
// )
// const ManuscriptPageContainer = React.lazy<
//   React.ComponentType<ManuscriptPageContainerProps>
// >(() =>
//   config.leanWorkflow.enabled
//     ? import(
//         /* webpackChunkName:"manuscript-page" */ './lean-workflow/ManuscriptPageContainerLW'
//       )
//     : import(
//         /* webpackChunkName:"manuscript-page" */ './ManuscriptPageContainer'
//       )
// )
// const APHORISM_DURATION =
//   Number(window.localStorage.getItem('aphorism-duration')) || 3000
// export interface ProjectPageContainerProps {
//   tokenActions: TokenActions
// }
// class ProjectPageContainer extends React.Component<
//   ProjectPageContainerProps &
//     RouteComponentProps<
//       {
//         projectID: string
//       },
//       Record<string, never>,
//       RouteLocationState
//     >
// > {
//   public render() {
//     const {
//       match: {
//         params: { projectID },
//       },
//     } = this.props
//     const message = this.props.location.state
//       ? this.props.location.state.infoMessage
//       : null
//     return (
//       <>
//         <ProjectAphorismPlaceholder
//           duration={APHORISM_DURATION}
//           key={projectID}
//         />
//         <Switch>
//           <Route
//             path={'/projects/:projectID/'}
//             exact={true}
//             render={(
//               props: RouteComponentProps<
//                 {
//                   projectID: string
//                 },
//                 Record<string, never>,
//                 RouteLocationState
//               >
//             ) => (
//               <ProjectManuscriptsData projectID={projectID} {...props}>
//                 {(
//                   manuscripts,
//                   collection: Collection<Manuscript>,
//                   restartSync
//                 ) => {
//                   if (
//                     !manuscripts.length ||
//                     (props.location.state && props.location.state.empty)
//                   ) {
//                     return (
//                       <EmptyProjectPageContainer
//                         project={project}
//                         user={user}
//                         message={message || ''}
//                         restartSync={restartSync}
//                       />
//                     )
//                   }
//                   const manuscriptID = lastOpenedManuscriptID(
//                     projectID,
//                     userProjects
//                   )
//                   if (manuscriptID) {
//                     return (
//                       <Redirect
//                         to={{
//                           pathname: `/projects/${project._id}/manuscripts/${manuscriptID}`,
//                           state: {
//                             infoMessage: message,
//                           },
//                         }}
//                       />
//                     )
//                   }
//                   manuscripts.sort(
//                     (a, b) => Number(a.createdAt) - Number(b.createdAt)
//                   )
//                   return (
//                     <Redirect
//                       to={{
//                         pathname: `/projects/${project._id}/manuscripts/${manuscripts[0]._id}`,
//                         state: {
//                           infoMessage: message,
//                         },
//                       }}
//                     />
//                   )
//                 }}
//               </ProjectManuscriptsData>
//             )}
//           />
//           <Route
//             path={'/projects/:projectID/manuscripts/:manuscriptID'}
//             exact={true}
//             render={(
//               props: RouteComponentProps<{
//                 manuscriptID: string
//                 projectID: string
//               }>
//             ) => {
//               const { manuscriptID, projectID } = props.match.params
//               return (
//                 <ManuscriptPageContainer
//                   {...props}
//                   tags={tags}
//                   comments={comments}
//                   keywords={keywords}
//                   library={library}
//                   manuscript={manuscript}
//                   manuscripts={manuscripts}
//                   notes={notes}
//                   project={project}
//                   projects={projects}
//                   projectsCollection={projectsCollection}
//                   user={user}
//                   collaborators={buildCollaboratorProfiles(collaborators, user)}
//                   collaboratorsById={buildCollaboratorProfiles(
//                     collaborators,
//                     user,
//                     '_id'
//                   )}
//                   userProjects={userProjects}
//                   userProjectsCollection={userProjectCollection}
//                   tokenActions={this.props.tokenActions}
//                 />
//               )
//             }}
//           />
//           <Route
//             path={
//               '/projects/:projectID/library/:sourceType?/:sourceID?/:filterID?'
//             }
//             render={(props) => (
//               <ProjectLibraryCollectionsData projectID={projectID}>
//                 {(
//                   projectLibraryCollections,
//                   projectLibraryCollectionsCollection
//                 ) => (
//                   <React.Suspense fallback={<ProjectPlaceholder />}>
//                     <LibraryPageContainer
//                       {...props}
//                       project={project}
//                       projectLibrary={library}
//                       projectLibraryCollection={libraryCollection}
//                       projectLibraryCollections={projectLibraryCollections}
//                       projectLibraryCollectionsCollection={
//                         projectLibraryCollectionsCollection
//                       }
//                       globalLibraries={globalLibraries}
//                       globalLibraryCollections={globalLibraryCollections}
//                       globalLibraryItems={globalLibraryItems}
//                       user={user}
//                     />
//                   </React.Suspense>
//                 )}
//               </ProjectLibraryCollectionsData>
//             )}
//           />
//           <Route
//             path={'/projects/:projectID/collaborators'}
//             exact={true}
//             render={(
//               props: RouteComponentProps<
//                 {
//                   projectID: string
//                 },
//                 Record<string, never>,
//                 RouteLocationState
//               >
//             ) => (
//               <ProjectInvitationsData projectID={projectID} {...props}>
//                 {(invitations) => (
//                   <ContainerInvitationsData containerID={projectID} {...props}>
//                     {(containerInvitations) => (
//                       <CollaboratorsPageContainer
//                         {...props}
//                         invitations={buildInvitations(
//                           invitations,
//                           containerInvitations
//                         )}
//                         project={project}
//                         user={user}
//                         collaborators={buildCollaboratorProfiles(
//                           collaborators,
//                           user
//                         )}
//                         tokenActions={this.props.tokenActions}
//                       />
//                     )}
//                   </ContainerInvitationsData>
//                 )}
//               </ProjectInvitationsData>
//             )}
//           />
//           <Route
//             path={'/projects/:projectID/collaborators/add'}
//             exact={true}
//             render={(props) => (
//               <ProjectInvitationsData projectID={projectID} {...props}>
//                 {(invitations) => (
//                   <ContainerInvitationsData containerID={projectID} {...props}>
//                     {(containerInvitations) => (
//                       <ProjectsData>
//                         {(projects) => (
//                           <AddCollaboratorsPageContainer
//                             {...props}
//                             invitations={buildInvitations(
//                               invitations,
//                               containerInvitations
//                             )}
//                             project={project}
//                             projects={projects}
//                             user={user}
//                             collaborators={buildCollaboratorProfiles(
//                               collaborators,
//                               user
//                             )}
//                             tokenActions={this.props.tokenActions}
//                           />
//                         )}
//                       </ProjectsData>
//                     )}
//                   </ContainerInvitationsData>
//                 )}
//               </ProjectInvitationsData>
//             )}
//           />
//           <Route
//             path="/projects/:projectID/history/:snapshotID/manuscript/:manuscriptID"
//             render={(props) => (
//               <HistoricalView project={project} user={user} {...props} />
//             )}
//           />
//           <Route
//             path={'/projects/:projectID/diagnostics'}
//             exact={true}
//             render={() => (
//               <ProjectModelsData projectID={projectID}>
//                 {(data) => (
//                   <ProjectDiagnosticsPageContainer
//                     data={data}
//                     projectID={projectID}
//                   />
//                 )}
//               </ProjectModelsData>
//             )}
//           />
//         </Switch>
//       </>
//     )
//   }
// }
// export default ProjectPageContainer
//# sourceMappingURL=ProjectPageContainer.js.map