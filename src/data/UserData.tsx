import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { ObjectTypes, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { buildUser } from '../lib/data'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (user: UserProfileWithAvatar) => React.ReactNode
  userID: string
}

interface State {
  user?: UserProfileWithAvatar
}

class UserData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { userID } = this.props

    this.sub = this.loadUser(userID)
  }

  public componentWillReceiveProps(nextProps: ModelsProps & Props) {
    const { userID } = nextProps

    if (userID !== this.props.userID) {
      this.sub.unsubscribe()
      this.setState({ user: undefined })
      this.sub = this.loadUser(userID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { user } = this.state

    if (!user) {
      return <Spinner />
    }

    return this.props.children(user)
  }

  private loadUser = (userID: string) => {
    const collection = this.props.models.collection as RxCollection<UserProfile>

    // NOTE: finding by `userID` not `_id`
    return collection
      .findOne({
        userID,
        objectType: ObjectTypes.UserProfile,
      })
      .$.subscribe(async doc => {
        if (doc) {
          this.setState({
            user: await buildUser(doc),
          })
        }
      })
  }
}

export default withModels<Props>(UserData)
