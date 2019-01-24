import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { ObjectTypes, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { buildUserMap } from '../lib/data'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (data: Map<string, UserProfileWithAvatar>) => React.ReactNode
  placeholder?: React.ReactNode
}

interface State {
  data?: Map<string, UserProfileWithAvatar>
}

class CollaboratorsData extends DataComponent<UserProfile, Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<UserProfile>(
      'collaborators'
    )
  }

  public componentDidMount() {
    this.collection.addEventListener('complete', this.handleComplete)

    this.sub = this.subscribe()
  }

  public componentWillUnmount() {
    this.collection.removeEventListener('complete', this.handleComplete)

    this.sub.unsubscribe()
  }

  private subscribe = () =>
    this.collection
      .find({
        objectType: ObjectTypes.UserProfile,
      })
      .$.subscribe(async docs => {
        if (docs) {
          this.setState({
            data: await buildUserMap(docs),
          })
        }
      })
}

export default CollaboratorsData
