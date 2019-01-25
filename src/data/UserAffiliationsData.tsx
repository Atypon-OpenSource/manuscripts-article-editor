import {
  ObjectTypes,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Collection } from '../sync/Collection'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (
    data: Map<string, UserProfileAffiliation>,
    collection: Collection<UserProfileAffiliation>
  ) => React.ReactNode
  profileID: string
}

interface State {
  data?: Map<string, UserProfileAffiliation>
}

class UserAffiliationsData extends DataComponent<
  UserProfileAffiliation,
  Props,
  State
> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<UserProfileAffiliation>(
      'user'
    )
  }

  public componentDidMount() {
    const { profileID } = this.props

    this.collection.addEventListener('complete', this.handleComplete)

    this.sub = this.subscribe(profileID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { profileID } = nextProps

    if (profileID !== this.props.profileID) {
      this.sub.unsubscribe()

      this.setState({ data: undefined })

      this.sub = this.subscribe(profileID)
    }
  }

  public componentWillUnmount() {
    this.collection.addEventListener('complete', this.handleComplete)

    this.sub.unsubscribe()
  }

  private subscribe = (containerID: string) =>
    this.collection
      .find({
        containerID,
        objectType: ObjectTypes.UserProfileAffiliation,
      })
      .$.subscribe(docs => {
        if (docs) {
          const data = new Map()

          for (const doc of docs) {
            data.set(doc._id, doc.toJSON())
          }

          this.setState({ data })
        }
      })
}

export default UserAffiliationsData
