import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { ObjectTypes, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { buildUser } from '../lib/data'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (user: UserProfileWithAvatar | null) => React.ReactNode
  userID: string | null
}

interface State {
  user?: UserProfileWithAvatar | null
}

class UserOrNullData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { userID } = this.props

    if (userID) {
      this.sub = this.loadUser(userID)
    } else {
      this.setState({ user: null })
    }
  }

  public componentWillReceiveProps(nextProps: ModelsProps & Props) {
    const { userID } = nextProps

    if (userID !== this.props.userID) {
      if (this.sub) {
        this.sub.unsubscribe()
      }

      if (userID) {
        this.setState({ user: undefined })
        this.sub = this.loadUser(userID)
      } else {
        this.setState({ user: null })
      }
    }
  }

  public componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  public render() {
    const { user } = this.state

    if (user === undefined) {
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
        this.setState({
          user: doc ? await buildUser(doc) : null,
        })
      })
  }
}

export default withModels<Props>(UserOrNullData)
