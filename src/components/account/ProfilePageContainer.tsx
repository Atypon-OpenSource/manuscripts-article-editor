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
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { ProfileErrors, ProfileValues } from './ProfileForm'
import ProfilePage from './ProfilePage'

type Props = UserProps & RouteComponentProps<{}> & ModelsProps

class ProfilePageContainer extends React.Component<Props> {
  public render() {
    const userID = getCurrentUserId()!

    return (
      <UserData userID={userID}>
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
                saveUserProfileAvatar={this.saveUserProfileAvatar}
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

    const userProfile = {
      ...user,
      ...values,
      affiliations: values.affiliations.map(item => item._id),
    }

    this.props.user.update(userProfile).then(
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

  private saveUserProfileAvatar = (data: Blob) =>
    this.props.user.putAttachment({
      id: 'image',
      type: data.type,
      data,
    })
}

export default withModels(withUser(ProfilePageContainer))
