import {
  buildUserProfileAffiliation,
  USER_PROFILE_AFFILIATION,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-editor'
import { UserProfileAffiliation } from '@manuscripts/manuscripts-json-schema'
import { FormikActions, FormikErrors } from 'formik'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { RouteComponentProps } from 'react-router'
import { RxAttachmentCreator, RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { ProfileErrors, ProfileValues } from './ProfileForm'
import ProfilePage from './ProfilePage'

interface State {
  affiliationMap: Map<string, UserProfileAffiliation>
  userWithAvatar: UserProfileWithAvatar | null
  affiliationsLoaded: boolean
}

type Props = UserProps & RouteComponentProps<{}> & ModelsProps

class ProfilePageContainer extends React.Component<Props> {
  public state: Readonly<State> = {
    affiliationMap: new Map(),
    userWithAvatar: this.props.user.data,
    affiliationsLoaded: false,
  }

  private userWithAvatar: UserProfileWithAvatar = this.props.user.data!

  private subs: Subscription[] = []

  private avatarEditorRef = React.createRef<AvatarEditor>()

  public async componentDidMount() {
    this.subs.push(this.loadAffiliations())

    await this.getUserProfileAvatar()
  }

  public async componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { user } = this.props
    const { affiliationMap, userWithAvatar, affiliationsLoaded } = this.state

    if (!user.loaded) {
      return null
    }

    if (!user.data || !affiliationsLoaded) {
      return null
    }

    return (
      <ProfilePage
        userWithAvatar={userWithAvatar!}
        affiliationsMap={affiliationMap}
        handleSave={this.handleSave}
        avatarEditorRef={this.avatarEditorRef}
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

  private saveUserProfileAvatar = () =>
    this.avatarEditorRef.current!.getImage().toBlob(async blob => {
      const attachment: RxAttachmentCreator = {
        id: 'image',
        type: blob!.type,
        data: blob!,
      }

      await this.props.user.putAttachment(attachment)
    })

  private getUserProfileAvatar = async () => {
    const attachment = await this.props.user.getAttachment('image')

    if (attachment) {
      this.userWithAvatar.avatar = window.URL.createObjectURL(
        await attachment.getData()
      )

      this.setState({ userWithAvatar: this.userWithAvatar })
    }
  }
}

export default withModels(withUser(ProfilePageContainer))
