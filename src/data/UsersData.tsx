import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { ObjectTypes, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { buildUserMap } from '../lib/data'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (users: Map<string, UserProfileWithAvatar>) => React.ReactNode
}

interface State {
  users?: Map<string, UserProfileWithAvatar>
}

class UsersData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    this.sub = this.loadUserMap()
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { users } = this.state

    if (!users) {
      return <Spinner />
    }

    return this.props.children(users)
  }

  private loadUserMap = () => {
    const collection = this.props.models.collection as RxCollection<UserProfile>

    return collection
      .find({
        objectType: ObjectTypes.UserProfile,
      })
      .$.subscribe(async docs => {
        if (docs) {
          this.setState({
            users: await buildUserMap(docs),
          })
        }
      })
  }
}

export default withModels<Props>(UsersData)
