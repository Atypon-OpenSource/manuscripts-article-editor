import {
  buildUserProfileAffiliation,
  USER_PROFILE_AFFILIATION,
} from '@manuscripts/manuscript-editor'
import { UserProfileAffiliation } from '@manuscripts/manuscripts-json-schema'
import { FormikActions, FormikErrors } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { ProfileErrors, ProfileValues } from './ProfileForm'
import ProfilePage from './ProfilePage'

interface State {
  affiliationMap: Map<string, UserProfileAffiliation>
  affiliationsLoaded: boolean
}

type Props = UserProps & RouteComponentProps<{}> & ModelsProps

class ProfilePageContainer extends React.Component<Props> {
  public state: Readonly<State> = {
    affiliationMap: new Map(),
    affiliationsLoaded: false,
  }

  private subs: Subscription[] = []

  public async componentDidMount() {
    this.subs.push(this.loadAffiliations())
  }

  public async componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { user } = this.props
    const { affiliationMap, affiliationsLoaded } = this.state

    if (!user.loaded) {
      return null
    }

    if (!user.data || !affiliationsLoaded) {
      return null
    }

    return (
      <ProfilePage
        userWithAvatar={user.data}
        affiliationsMap={affiliationMap}
        handleSave={this.handleSave}
        handleChangePassword={this.handleChangePassword}
        handleDeleteAccount={this.handleDeleteAccount}
        handleClose={this.handleClose}
        saveUserProfileAvatar={this.saveUserProfileAvatar}
        createAffiliation={this.createAffiliation}
      />
    )
  }

  private handleSave = async (
    values: ProfileValues,
    { setSubmitting, setErrors }: FormikActions<ProfileValues | ProfileErrors>
  ) => {
    const { data: user } = this.props.user

    await Promise.all(
      values.affiliations.map((item: UserProfileAffiliation) =>
        this.props.models.saveModel<UserProfileAffiliation>(item, {
          userProfileID: user!._id,
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

  private createAffiliation = async (institution: string) => {
    const userProfileAffiliation = buildUserProfileAffiliation(institution)

    return this.props.models.saveModel<UserProfileAffiliation>(
      userProfileAffiliation,
      {
        userProfileID: this.props.user.data!._id,
      }
    )
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  private loadAffiliations = () =>
    this.getCollection()
      .find({
        objectType: USER_PROFILE_AFFILIATION,
        containerID: this.props.user.data!._id,
      })
      .$.subscribe(async (docs: Array<RxDocument<UserProfileAffiliation>>) => {
        const affiliationMap: Map<string, UserProfileAffiliation> = new Map()
        for (const doc of docs) {
          const affiliation = doc.toJSON() as UserProfileAffiliation
          affiliationMap.set(affiliation._id, affiliation)
        }

        this.setState({ affiliationMap }, () =>
          this.setState({ affiliationsLoaded: true })
        )
      })

  private saveUserProfileAvatar = (data: Blob) =>
    this.props.user.putAttachment({
      id: 'image',
      type: data.type,
      data,
    })
}

export default withModels(withUser(ProfilePageContainer))
