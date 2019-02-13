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

import {
  COMMENT_ANNOTATION,
  CommentAnnotation,
} from '@manuscripts/manuscript-editor'
import React from 'react'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (data: CommentAnnotation[]) => React.ReactNode
  manuscriptID: string
  projectID: string
}

interface State {
  data?: CommentAnnotation[]
}

class ManuscriptCommentsData extends DataComponent<
  CommentAnnotation,
  Props,
  State
> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<CommentAnnotation>(
      `project-${props.projectID}`
    )
  }

  public componentDidMount() {
    const { projectID, manuscriptID } = this.props

    this.collection.addEventListener('complete', this.handleComplete)

    this.sub = this.subscribe(projectID, manuscriptID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { projectID, manuscriptID } = nextProps

    if (
      manuscriptID !== this.props.manuscriptID ||
      projectID !== this.props.projectID
    ) {
      this.sub.unsubscribe()
      this.setState({ data: undefined })

      if (projectID !== this.props.projectID) {
        this.collection.removeEventListener('complete', this.handleComplete)
        this.collection = CollectionManager.getCollection<CommentAnnotation>(
          `project-${projectID}`
        )
        this.collection.addEventListener('complete', this.handleComplete)
      }

      this.sub = this.subscribe(projectID, manuscriptID)
    }
  }

  public componentWillUnmount() {
    this.collection.removeEventListener('complete', this.handleComplete)
    this.sub.unsubscribe()
  }

  private subscribe = (containerID: string, manuscriptID: string) =>
    this.collection
      .find({
        containerID,
        manuscriptID,
        objectType: COMMENT_ANNOTATION,
        // objectType: ObjectTypes.CommentAnnotation, // TODO
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            data: docs.map(doc => doc.toJSON()),
          })
        }
      })
}

export default ManuscriptCommentsData
