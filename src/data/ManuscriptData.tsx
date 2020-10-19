/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { Manuscript } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (data: Manuscript) => React.ReactNode
  manuscriptID: string
  projectID: string
}

interface State {
  data?: Manuscript
}

class ManuscriptData extends DataComponent<Manuscript, Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<Manuscript>(
      `project-${props.projectID}`
    )
  }

  public componentDidMount() {
    const { manuscriptID } = this.props

    this.sub = this.subscribe(manuscriptID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { manuscriptID, projectID } = nextProps

    if (
      manuscriptID !== this.props.manuscriptID ||
      projectID !== this.props.projectID
    ) {
      this.sub.unsubscribe()

      this.setState({ data: undefined })

      if (projectID !== this.props.projectID) {
        this.collection = CollectionManager.getCollection<Manuscript>(
          `project-${projectID}`
        )
      }

      this.sub = this.subscribe(manuscriptID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  private subscribe = (manuscriptID: string) =>
    this.collection.findOne(manuscriptID).$.subscribe(async (doc) => {
      if (doc) {
        this.setState({
          data: doc.toJSON(),
        })
      }
    })
}

export default ManuscriptData
