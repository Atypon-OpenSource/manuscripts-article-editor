import { buildUserProfileAffiliation } from '@manuscripts/manuscript-editor'
import {
  UserProfile,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import { FormikActions, FormikErrors } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import UserAffiliationsData from '../../data/UserAffiliationsData'
import UserData from '../../data/UserData'
import { getCurrentUserId } from '../../lib/user'
import { Collection } from '../../sync/Collection'
import { ProfileErrors, ProfileValues } from './ProfileForm'
import ProfilePage from './ProfilePage'

class ProfilePageContainer extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <UserData userID={getCurrentUserId()!}>
        {(user, userCollection) => (
          <UserAffiliationsData profileID={user._id}>
            {(affiliations, affiliationsCollection) => (
              <ProfilePage
                userWithAvatar={user}
                affiliationsMap={affiliations}
                handleSave={this.handleSave(
                  user,
                  userCollection,
                  affiliationsCollection
                )}
                handleChangePassword={this.handleChangePassword}
                handleDeleteAccount={this.handleDeleteAccount}
                handleClose={this.handleClose}
                saveUserProfileAvatar={this.saveUserProfileAvatar(
                  user._id,
                  userCollection
                )}
                deleteUserProfileAvatar={this.deleteUserProfileAvatar(
                  user._id,
                  userCollection
                )}
                createAffiliation={this.createAffiliation(
                  user._id,
                  affiliationsCollection
                )}
              />
            )}
          </UserAffiliationsData>
        )}
      </UserData>
    )
  }

  private handleSave = (
    user: UserProfile,
    userCollection: Collection<UserProfile>,
    affiliationsCollection: Collection<UserProfileAffiliation>
  ) => async (
    values: ProfileValues,
    { setSubmitting, setErrors }: FormikActions<ProfileValues | ProfileErrors>
  ) => {
    // await Promise.all(
    //   values.affiliations.map((item: UserProfileAffiliation) =>
    //     affiliationsCollection.save(item, {
    //       containerID: user._id,
    //     })
    //   )
    // )

    const data = {
      ...values,
      affiliations: values.affiliations.map(item => item._id),
    }

    userCollection.update(user._id, data).then(
      () => setSubmitting(false),
      error => {
        setSubmitting(false)

        const errors: FormikErrors<ProfileErrors> = {
          submit: error.response
            ? error.response.data.error
            : 'There was an error',
        }

        setErrors(errors)
      }
    )
  }

  private handleChangePassword = () =>
    this.props.history.push('/change-password')

  private handleDeleteAccount = () => this.props.history.push('/delete-account')

  private handleClose = () => this.props.history.goBack()

  private createAffiliation = (
    containerID: string,
    affiliationsCollection: Collection<UserProfileAffiliation>
  ) => (institution: string) => {
    const userProfileAffiliation = buildUserProfileAffiliation(institution)

    return affiliationsCollection.create(userProfileAffiliation, {
      containerID,
    })
  }

  private saveUserProfileAvatar = (
    id: string,
    userCollection: Collection<UserProfile>
  ) => (data: Blob) =>
    userCollection.attach(id, {
      id: 'image',
      type: data.type,
      data,
    })

  private deleteUserProfileAvatar = (
    id: string,
    userCollection: Collection<UserProfile>
  ) => async () => {
    const doc = await userCollection.findOne(id).exec()

    if (!doc) {
      throw new Error('Document not found')
    }

    const attachment = await doc.getAttachment('image')

    return attachment.remove()
  }
}

export default ProfilePageContainer
