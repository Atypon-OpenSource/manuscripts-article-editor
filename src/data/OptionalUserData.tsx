import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Loading } from '../components/Loading'
import { buildUser } from '../lib/data'
import { Collection } from '../sync/Collection'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (
    data: UserProfile | null,
    collection: Collection<UserProfile>
  ) => React.ReactNode
  placeholder?: React.ReactNode
  userProfileID: string
}

interface State {
  data?: UserProfile | null
}

class OptionalUserData extends DataComponent<UserProfile, Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<UserProfile>('user')
  }

  public componentDidMount() {
    const { userProfileID } = this.props

    // TODO: handle "error"?
    this.collection.addEventListener('complete', this.handleComplete)
    this.sub = this.subscribe(userProfileID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { userProfileID } = nextProps

    if (userProfileID !== this.props.userProfileID) {
      if (this.sub) {
        this.sub.unsubscribe()
      }

      this.collection.removeEventListener('complete', this.handleComplete)

      this.setState({ data: undefined })
      this.collection.addEventListener('complete', this.handleComplete)
      this.sub = this.subscribe(userProfileID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
    this.collection.removeEventListener('complete', this.handleComplete)
  }

  public render() {
    const { data } = this.state

    if (data === undefined || !this.collection.status.pull.complete) {
      return <Loading />
    }

    return this.props.children(data, this.collection)
  }

  private subscribe = (userProfileID: string) =>
    this.collection.findOne(userProfileID).$.subscribe(async doc => {
      this.setState({
        data: doc ? await buildUser(doc) : null,
      })
    })
}

export default OptionalUserData
