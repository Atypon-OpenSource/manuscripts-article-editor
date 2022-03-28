"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ApolloProvider } from '@apollo/react-hooks'
// import AppIcon from '@manuscripts/assets/react/AppIcon'
// import React from 'react'
// import { hot } from 'react-hot-loader'
// import type { RouteComponentProps } from 'react-router'
// import { Redirect, Route, Switch } from 'react-router-dom'
// import ChangePasswordPageContainer from './components/account/ChangePasswordPageContainer'
// import CommunityLoginPageContainer from './components/account/CommunityLoginPageContainer'
// import DeleteAccountPageContainer from './components/account/DeleteAccountPageContainer'
// import FeedbackPageContainer from './components/account/FeedbackPageContainer'
// import LoginPageContainer from './components/account/LoginPageContainer'
// import LogoutPageContainer from './components/account/LogoutPageContainer'
// import RecoverPageContainer from './components/account/RecoverPageContainer'
// import { RetrieveAccountPageContainer } from './components/account/RetrieveAccountPageContainer'
// import SignupPageContainer from './components/account/SignupPageContainer'
// import AcceptInvitationRequireLoginContainer from './components/collaboration/AcceptInvitationRequireLoginContainer'
// import AcceptProjectInvitation from './components/collaboration/AcceptProjectInvitation'
// import AcceptInvitationByEmailContainer from './components/collaboration/AcceptProjectInvitationByEmailContainer'
// import AcceptInvitationURIContainer from './components/collaboration/AcceptProjectInvitationURIPageContainer'
// import { DatabaseContext } from './components/DatabaseProvider'
// import { Frontmatter } from './components/Frontmatter'
// import { LoadingPage } from './components/Loading'
// import { NewProjectPageContainerProps } from './components/projects/NewProjectPageContainer'
// import { ProjectPageContainerProps } from './components/projects/ProjectPageContainer'
// import { ProjectsPageContainerProps } from './components/projects/ProjectsPageContainer'
// import { RequireLogin } from './components/RequireLogin'
// import { SorryPage } from './components/RetrieveAccountPage'
// import config from './config'
// import OptionalUserData from './data/OptionalUserData'
// import { TokenData } from './data/TokenData'
// import { apolloClient } from './lib/apollo'
// import invitationTokenHandler from './lib/invitation-token'
// import { Picker } from './picker/Picker'
// import Sync from './sync/Sync'
// import type { RouteLocationState } from './types/router-state'
// const DeveloperPageContainer = React.lazy(
//   () =>
//     import(
//       /* webpackChunkName:"developer-page" */ './components/DeveloperPageContainer'
//     )
// )
// const DiagnosticsPageContainer = React.lazy(
//   () =>
//     import(
//       /* webpackChunkName:"diagnostics-page" */ './components/diagnostics/DiagnosticsPageContainer'
//     )
// )
// const NewProjectPageContainer = React.lazy<
//   React.ComponentType<NewProjectPageContainerProps>
// >(
//   () =>
//     import(
//       /* webpackChunkName:"new-project-page" */ './components/projects/NewProjectPageContainer'
//     )
// )
// const NotFoundPage = React.lazy(
//   () =>
//     import(/* webpackChunkName:"not-found-page" */ './components/NotFoundPage')
// )
// const ProfilePageContainer = React.lazy(
//   () =>
//     import(
//       /* webpackChunkName:"profile-page" */ './components/account/ProfilePageContainer'
//     )
// )
// const ProjectPageContainer = React.lazy<
//   React.ComponentType<ProjectPageContainerProps>
// >(
//   () =>
//     import(
//       /* webpackChunkName:"project-page" */ './components/projects/ProjectPageContainer'
//     )
// )
// const ProjectsPageContainer = React.lazy<
//   React.ComponentType<ProjectsPageContainerProps>
// >(
//   () =>
//     import(
//       /* webpackChunkName:"projects-page" */ './components/projects/ProjectsPageContainer'
//     )
// )
// const App: React.FunctionComponent = () => (
//   <DatabaseContext.Consumer>
//     {(db) => (
//       <React.Fragment>
//         <TokenData>
//           {({ userID, userProfileID }, tokenActions) =>
//             userID ? (
//               <Sync
//                 collection={'user'}
//                 channels={[
//                   userID, // invitations
//                   `${userID}-readwrite`, // profile
//                   `${userProfileID}-readwrite`, // profile
//                   `${userID}-projects`, // projects
//                   `${userID}-libraries`, // libraries
//                   `${userID}-library-collections`, // library collections
//                 ]}
//                 db={db}
//                 tokenActions={tokenActions}
//               >
//                 <Sync
//                   collection={'collaborators'}
//                   db={db}
//                   tokenActions={tokenActions}
//                 >
//                   <ApolloProvider client={apolloClient}>
//                     <OptionalUserData
//                       userProfileID={userProfileID!}
//                       placeholder={
//                         <LoadingPage>
//                           <AppIcon />
//                         </LoadingPage>
//                       }
//                     >
//                       {(user) => (
//                         <Switch>
//                           <Route
//                             path={'/'}
//                             exact={true}
//                             render={() =>
//                               user ? (
//                                 <Redirect to={'/projects'} />
//                               ) : config.connect.enabled ? (
//                                 <Redirect
//                                   to={{
//                                     pathname: `/login`,
//                                     state: {
//                                       errorMessage: 'missing-user-profile',
//                                     },
//                                   }}
//                                 />
//                               ) : (
//                                 <Redirect
//                                   to={{
//                                     pathname: `/signup`,
//                                     state: {
//                                       errorMessage: 'missing-user-profile',
//                                     },
//                                   }}
//                                 />
//                               )
//                             }
//                           />
//                           {config.native && (
//                             <Route
//                               path={'/new-project'}
//                               exact={true}
//                               render={(props) =>
//                                 user ? (
//                                   <NewProjectPageContainer
//                                     user={user}
//                                     {...props}
//                                   />
//                                 ) : (
//                                   <RequireLogin
//                                     {...props}
//                                     profileMissing={true}
//                                   />
//                                 )
//                               }
//                             />
//                           )}
//                           <Route
//                             path={'/picker'}
//                             exact={true}
//                             render={(props) =>
//                               user ? (
//                                 <Picker
//                                   {...props}
//                                   db={db}
//                                   tokenActions={tokenActions}
//                                 />
//                               ) : (
//                                 <RequireLogin
//                                   {...props}
//                                   profileMissing={true}
//                                 />
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/login'}
//                             exact={true}
//                             render={(
//                               props: RouteComponentProps<
//                                 Record<string, never>,
//                                 Record<string, never>,
//                                 RouteLocationState
//                               >
//                             ) =>
//                               user ? (
//                                 <Redirect to={'/projects'} />
//                               ) : (
//                                 <Frontmatter>
//                                   <LoginPageContainer {...props} />
//                                 </Frontmatter>
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/signup'}
//                             exact={true}
//                             render={(
//                               props: RouteComponentProps<
//                                 Record<string, never>,
//                                 Record<string, never>,
//                                 RouteLocationState
//                               >
//                             ) =>
//                               user ? (
//                                 <Redirect to={'/projects'} />
//                               ) : (
//                                 <Frontmatter>
//                                   <SignupPageContainer {...props} />
//                                 </Frontmatter>
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/recover'}
//                             exact={true}
//                             render={(props) =>
//                               user ? (
//                                 <Redirect to={'/projects'} />
//                               ) : (
//                                 <RecoverPageContainer {...props} />
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/change-password'}
//                             exact={true}
//                             render={(props) =>
//                               user ? (
//                                 <ChangePasswordPageContainer
//                                   {...props}
//                                   tokenActions={tokenActions}
//                                 />
//                               ) : (
//                                 <RequireLogin
//                                   {...props}
//                                   profileMissing={true}
//                                 />
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/community'}
//                             exact={true}
//                             render={(
//                               props: RouteComponentProps<
//                                 { sig: string; sso: string },
//                                 Record<string, never>,
//                                 RouteLocationState
//                               >
//                             ) =>
//                               user ? (
//                                 <CommunityLoginPageContainer {...props} />
//                               ) : (
//                                 <RequireLogin {...props}>
//                                   Please sign in here at Manuscripts.io first.
//                                   Your Manuscripts.io account signs you in also
//                                   to community.manuscripts.io.
//                                 </RequireLogin>
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/delete-account'}
//                             exact={true}
//                             render={(props) =>
//                               user ? (
//                                 <DeleteAccountPageContainer
//                                   tokenActions={tokenActions}
//                                   {...props}
//                                 />
//                               ) : (
//                                 <RequireLogin
//                                   {...props}
//                                   profileMissing={true}
//                                 />
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/retrieve-account'}
//                             exact={true}
//                             component={RetrieveAccountPageContainer}
//                           />
//                           <Route
//                             path={'/profile'}
//                             exact={true}
//                             render={(props) =>
//                               user ? (
//                                 <ProfilePageContainer {...props} />
//                               ) : (
//                                 <RequireLogin
//                                   {...props}
//                                   profileMissing={true}
//                                 />
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/feedback'}
//                             render={(props) =>
//                               user ? (
//                                 <FeedbackPageContainer
//                                   tokenActions={tokenActions}
//                                   {...props}
//                                 />
//                               ) : (
//                                 <RequireLogin
//                                   {...props}
//                                   profileMissing={true}
//                                 />
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/projects'}
//                             render={(props) =>
//                               user ? (
//                                 <Switch {...props}>
//                                   <Route
//                                     path={
//                                       '/projects/:projectID/invitation/:invitationToken'
//                                     }
//                                     component={AcceptInvitationURIContainer}
//                                   />
//                                   <Route
//                                     path={'/projects/:projectID'}
//                                     render={(props) => (
//                                       <ProjectPageContainer
//                                         {...props}
//                                         tokenActions={tokenActions}
//                                         key={props.match.params.projectID}
//                                       />
//                                     )}
//                                   />
//                                   <Route
//                                     path={'/projects'}
//                                     render={(
//                                       props: RouteComponentProps<
//                                         Record<string, never>,
//                                         Record<string, never>,
//                                         RouteLocationState
//                                       >
//                                     ) =>
//                                       invitationTokenHandler.get() ? (
//                                         <AcceptProjectInvitation {...props} />
//                                       ) : (
//                                         <ProjectsPageContainer
//                                           {...props}
//                                           tokenActions={tokenActions}
//                                           errorMessage={
//                                             props.location.state?.errorMessage
//                                           }
//                                         />
//                                       )
//                                     }
//                                   />
//                                 </Switch>
//                               ) : (
//                                 <Switch {...props}>
//                                   <Route
//                                     path={
//                                       '/projects/:projectID/invitation/:invitationToken'
//                                     }
//                                     component={
//                                       AcceptInvitationRequireLoginContainer
//                                     }
//                                   />
//                                   <Route
//                                     path={'/projects/:projectID'}
//                                     render={(props) => (
//                                       <RequireLogin
//                                         {...props}
//                                         profileMissing={true}
//                                       />
//                                     )}
//                                   />
//                                   <Route
//                                     path={'/projects'}
//                                     render={(props) => (
//                                       <RequireLogin
//                                         {...props}
//                                         profileMissing={true}
//                                       />
//                                     )}
//                                   />
//                                 </Switch>
//                               )
//                             }
//                           />
//                           <Route
//                             path={'/invitation'}
//                             exact={true}
//                             component={AcceptInvitationByEmailContainer}
//                           />
//                           <Route
//                             path={'/logout'}
//                             exact={true}
//                             render={(props) => (
//                               <LogoutPageContainer
//                                 {...props}
//                                 tokenActions={tokenActions}
//                               />
//                             )}
//                           />
//                           <Route
//                             path={'/developer'}
//                             exact={true}
//                             component={DeveloperPageContainer}
//                           />
//                           <Route
//                             path={'/diagnostics'}
//                             exact={true}
//                             component={DiagnosticsPageContainer}
//                           />
//                           <Route component={NotFoundPage} />
//                         </Switch>
//                       )}
//                     </OptionalUserData>
//                   </ApolloProvider>
//                 </Sync>
//               </Sync>
//             ) : (
//               <Switch>
//                 <Route
//                   path={'/'}
//                   exact={true}
//                   render={() => (
//                     <Frontmatter>
//                       <Redirect to={'/signup'} />
//                     </Frontmatter>
//                   )}
//                 />
//                 <Route
//                   path={'/login'}
//                   exact={true}
//                   render={(
//                     props: RouteComponentProps<
//                       Record<string, never>,
//                       Record<string, never>,
//                       RouteLocationState
//                     >
//                   ) => <LoginPageContainer {...props} />}
//                 />
//                 <Route
//                   path={'/signup'}
//                   exact={true}
//                   render={(
//                     props: RouteComponentProps<
//                       Record<string, never>,
//                       Record<string, never>,
//                       RouteLocationState
//                     >
//                   ) => (
//                     <Frontmatter>
//                       <SignupPageContainer {...props} />
//                     </Frontmatter>
//                   )}
//                 />
//                 <Route
//                   path={'/recover'}
//                   exact={true}
//                   render={(props) => (
//                     <Frontmatter>
//                       <RecoverPageContainer {...props} />
//                     </Frontmatter>
//                   )}
//                 />
//                 <Route
//                   path={'/change-password'}
//                   exact={true}
//                   render={(props) => (
//                     <RequireLogin {...props}>
//                       You must sign in first to change your password.
//                     </RequireLogin>
//                   )}
//                 />
//                 <Route
//                   path={'/community'}
//                   exact={true}
//                   render={(props) => (
//                     <RequireLogin {...props}>
//                       Please sign in here at Manuscripts.io first. Your
//                       Manuscripts.io account signs you in also to
//                       community.manuscripts.io.
//                     </RequireLogin>
//                   )}
//                 />
//                 <Route
//                   path={'/delete-account'}
//                   exact={true}
//                   render={(props) => (
//                     <RequireLogin {...props}>
//                       You must sign in first to delete your account.
//                     </RequireLogin>
//                   )}
//                 />
//                 <Route
//                   path={'/retrieve-account'}
//                   exact={true}
//                   render={(props) => (
//                     <RequireLogin {...props}>
//                       Please sign in first so you can retrieve your account.
//                     </RequireLogin>
//                   )}
//                 />
//                 <Route
//                   path={'/profile'}
//                   exact={true}
//                   component={RequireLogin}
//                 />
//                 <Route
//                   path={'/feedback'}
//                   render={(props) => (
//                     <RequireLogin {...props}>
//                       You must sign in first.
//                     </RequireLogin>
//                   )}
//                 />
//                 <Route path={'/projects'}>
//                   <Switch>
//                     <Route
//                       path={'/projects'}
//                       exact={true}
//                       render={(props) => (
//                         <RequireLogin {...props}>
//                           You must sign in first.
//                         </RequireLogin>
//                       )}
//                     />
//                     <Route
//                       path={'/projects/:projectID/invitation/:invitationToken'}
//                       exact={true}
//                       component={AcceptInvitationRequireLoginContainer}
//                     />
//                     <Route
//                       path={'/projects/:projectID/collaborators/add'}
//                       render={(props) => (
//                         <RequireLogin {...props}>
//                           You must sign in first.
//                         </RequireLogin>
//                       )}
//                     />
//                     <Route
//                       path={'/projects/:projectID/collaborators'}
//                       render={(props) => (
//                         <RequireLogin {...props}>
//                           You must sign in first.
//                         </RequireLogin>
//                       )}
//                     />
//                     <Route
//                       path={'/projects/:projectID'}
//                       render={(props) => (
//                         <RequireLogin {...props}>
//                           You must sign in to access this project.
//                         </RequireLogin>
//                       )}
//                     />
//                   </Switch>
//                 </Route>
//                 <Route
//                   path={'/invitation'}
//                   exact={true}
//                   component={AcceptInvitationRequireLoginContainer}
//                 />
//                 <Route
//                   path={'/logout'}
//                   exact={true}
//                   render={() => <Redirect to={'/'} />}
//                 />
//                 <Route
//                   path={'/developer'}
//                   exact={true}
//                   component={DeveloperPageContainer}
//                 />
//                 <Route path={'/sorry'} exact={true} component={SorryPage} />
//                 <Route component={NotFoundPage} />
//               </Switch>
//             )
//           }
//         </TokenData>
//       </React.Fragment>
//     )}
//   </DatabaseContext.Consumer>
// )
// export default hot(module)(App)
//# sourceMappingURL=App.js.map