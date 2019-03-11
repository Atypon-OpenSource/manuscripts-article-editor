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

import { ObjectTypes, UserProject } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Collection } from '../sync/Collection'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (
    data: UserProject[],
    collection: Collection<UserProject>
  ) => React.ReactNode
  projectID: string
}

interface State {
  data?: UserProject[]
}

class UserProjectsData extends DataComponent<UserProject, Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<UserProject>('user')
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
        objectType: ObjectTypes.UserProject,
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            data: docs.map(doc => doc.toJSON()),
          })
        }
      })
}

export default UserProjectsData
