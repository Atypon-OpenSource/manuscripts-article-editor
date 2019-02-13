/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
