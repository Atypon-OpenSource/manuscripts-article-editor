"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { buildUserProfileAffiliation } from '@manuscripts/manuscript-transform'
// import {
//   ObjectTypes,
//   UserProfile,
//   UserProfileAffiliation,
// } from '@manuscripts/manuscripts-json-schema'
// import { Category, Dialog } from '@manuscripts/style-guide'
// import { FormikErrors, FormikHelpers } from 'formik'
// import React, { useState } from 'react'
// import config from '../../config'
// import { logout } from '../../lib/account'
// import { markUserForDeletion } from '../../lib/api/authentication'
// import { PROFILE_IMAGE_ATTACHMENT } from '../../lib/data'
// import tokenHandler from '../../lib/token'
// import { useStore } from '../../store'
// import { Collection } from '../../sync/Collection'
// import { ProfileErrors, ProfileValues } from './ProfileForm'
// import { ProfilePageComponent } from './ProfilePage'
// const ProfilePage = React.lazy<ProfilePageComponent>(
//   () => import('./ProfilePage')
// )
// interface State {
//   confirmDelete: boolean
// }
// const ProfilePageContainer = (props) => {
//   const [state, setState] = useState<State>({
//     confirmDelete: false,
//   })
//   const { confirmDelete } = state
//   const actions = {
//     primary: {
//       action: async () => {
//         await markUserForDeletion()
//         await logout()
//         tokenHandler.remove()
//         window.location.assign('/sorry')
//       },
//       title: 'Delete Now',
//       isDestructive: true,
//     },
//     secondary: {
//       action: () =>
//         setState({
//           confirmDelete: false,
//         }),
//       title: 'Keep my account',
//     },
//   }
//   const [
//     { user, affiliations, updateUser, updateAffiliation, removeAffiliation },
//   ] = useStore((store) => ({
//     user: store.user,
//     affiliations: store.affiliations,
//     updateUser: store.updateUser,
//     updateAffiliation: store.updateAffiliation,
//     removeAffiliation: store.removeAffiliation,
//     updateUser: store.updateUser,
//   }))
//   if (confirmDelete) {
//     return (
//       <Dialog
//         isOpen={confirmDelete}
//         actions={actions}
//         category={Category.confirmation}
//         header={'Are you sure you want to delete your account?'}
//         message={
//           'Your projects will be gone forever, and you will no longer have access to the projects you were invited to.'
//         }
//         confirmFieldText={'DELETE'}
//       />
//     )
//   }
//   const handleSave = (
//     user: UserProfile,
//     userCollection: Collection<UserProfile>
//   ) => async (
//     values: ProfileValues,
//     { setSubmitting, setErrors }: FormikHelpers<ProfileValues | ProfileErrors>
//   ) =>
//     userCollection
//       .update(user._id, values)
//       .then(() => setSubmitting(false))
//       .catch((error) => {
//         setSubmitting(false)
//         const errors: FormikErrors<ProfileErrors> = {
//           submit: error.response
//             ? error.response.data.error
//             : 'There was an error',
//         }
//         setErrors(errors)
//       })
//   const handleChangePassword = () =>
//     config.connect.enabled
//       ? window.open(`${config.iam.url}/security/password`)
//       : props.history.push('/change-password')
//   const handleDeleteAccount = () =>
//     config.connect.enabled
//       ? setState({
//           confirmDelete: true,
//         })
//       : props.history.push('/delete-account')
//   const handleClose = () => props.history.goBack()
//   const createAffiliation = (
//     userID: string,
//     affiliationsCollection: Collection<UserProfileAffiliation>,
//     userCollection: Collection<UserProfile>
//   ) => async (institution: string) => {
//     const userProfileAffiliation = buildUserProfileAffiliation(institution)
//     try {
//       const user = await userCollection.findDoc(userID)
//       await user.atomicUpdate((current) => {
//         current.affiliations = current.affiliations || []
//         current.affiliations.push(userProfileAffiliation._id)
//         return current
//       })
//     } catch (e) {
//       console.error('Failed to create affiliation', e)
//     }
//     return affiliationsCollection.create(userProfileAffiliation, {
//       containerID: userID,
//     })
//   }
//   const updateAffiliation = (
//     affiliationsCollection: Collection<UserProfileAffiliation>
//   ) => async (data: Partial<UserProfileAffiliation>) => {
//     return affiliationsCollection.save({
//       ...data,
//       objectType: ObjectTypes.UserProfileAffiliation,
//     })
//   }
//   const removeAffiliation = (
//     affiliationsCollection: Collection<UserProfileAffiliation>
//   ) => async (data: UserProfileAffiliation) => {
//     return affiliationsCollection.delete(data._id)
//   }
//   const saveUserProfileAvatar = (
//     id: string,
//     userCollection: Collection<UserProfile>
//   ) => async (data: Blob) => {
//     await userCollection.putAttachment(id, {
//       id: PROFILE_IMAGE_ATTACHMENT,
//       type: data.type,
//       data,
//     })
//   }
//   const deleteUserProfileAvatar = (
//     id: string,
//     userCollection: Collection<UserProfile>
//   ) => async () => {
//     const doc = await userCollection.findOne(id).exec()
//     if (!doc) {
//       throw new Error('Document not found')
//     }
//     const attachment = doc.getAttachment(PROFILE_IMAGE_ATTACHMENT)
//     return attachment.remove()
//   }
//   return (
//     <React.Suspense fallback={null}>
//       <ProfilePage
//         userWithAvatar={user}
//         affiliationsMap={affiliations}
//         handleSave={handleSave(user, userCollection)}
//         handleChangePassword={handleChangePassword}
//         handleDeleteAccount={handleDeleteAccount}
//         handleClose={handleClose}
//         saveUserProfileAvatar={saveUserProfileAvatar(user._id, userCollection)}
//         deleteUserProfileAvatar={deleteUserProfileAvatar(
//           user._id,
//           userCollection
//         )}
//         createAffiliation={createAffiliation(
//           user._id,
//           affiliationsCollection,
//           userCollection
//         )}
//         updateAffiliation={updateAffiliation(affiliationsCollection)}
//         removeAffiliation={removeAffiliation(affiliationsCollection)}
//       />
//     </React.Suspense>
//   )
// }
// export default ProfilePageContainer
//# sourceMappingURL=ProfilePageContainer.js.map