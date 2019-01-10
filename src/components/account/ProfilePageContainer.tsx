import {
  buildUserProfileAffiliation,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-editor'
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
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { ProfileErrors, ProfileValues } from './ProfileForm'
import ProfilePage from './ProfilePage'

class ProfilePageContainer extends React.Component<
  RouteComponentProps & ModelsProps
> {
  public render() {
    return (
      <UserData userID={getCurrentUserId()!}>
        {user => (
          <UserAffiliationsData profileID={user._id}>
            {affiliations => (
              <ProfilePage
                userWithAvatar={user}
                affiliationsMap={affiliations}
                handleSave={this.handleSave(user)}
                handleChangePassword={this.handleChangePassword}
                handleDeleteAccount={this.handleDeleteAccount}
                handleClose={this.handleClose}
                saveUserProfileAvatar={this.saveUserProfileAvatar(user._id)}
                createAffiliation={this.createAffiliation(user._id)}
              />
            )}
          </UserAffiliationsData>
        )}
      </UserData>
    )
  }

  private handleSave = (user: UserProfile) => async (
    values: ProfileValues,
    { setSubmitting, setErrors }: FormikActions<ProfileValues | ProfileErrors>
  ) => {
    await Promise.all(
      values.affiliations.map((item: UserProfileAffiliation) =>
        this.props.models.saveModel<UserProfileAffiliation>(item, {
          userProfileID: user._id,
        })
      )
    )

    // TODO: remove avatar property?

    const userProfile = {
      ...user,
      ...values,
      affiliations: values.affiliations.map(item => item._id),
    }

    this.props.models.saveModel<UserProfileWithAvatar>(userProfile, {}).then(
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

  private createAffiliation = (userProfileID: string) => async (
    institution: string
  ) => {
    const userProfileAffiliation = buildUserProfileAffiliation(institution)

    return this.props.models.saveModel<UserProfileAffiliation>(
      userProfileAffiliation,
      {
        userProfileID,
      }
    )
  }

  private saveUserProfileAvatar = (id: string) => async (data: Blob) => {
    await this.props.models.putAttachment(id, {
      id: 'image',
      type: data.type,
      data,
    })
  }
}

export default withModels(ProfilePageContainer)
