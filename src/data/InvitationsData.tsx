import {
  ObjectTypes,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (data: ProjectInvitation[]) => React.ReactNode
}

interface State {
  data?: ProjectInvitation[]
}

class InvitationsData extends DataComponent<ProjectInvitation, Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<ProjectInvitation>(
      'user' /* 'invitations' */
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
        objectType: ObjectTypes.ProjectInvitation,
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            data: docs.map(doc => doc.toJSON()),
          })
        }
      })
}

export default InvitationsData
