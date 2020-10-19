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

import {
  BibliographyItem,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import { Collection } from '../sync/Collection'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (
    data: Map<string, BibliographyItem>,
    collection: Collection<BibliographyItem>
  ) => React.ReactNode
}

interface State {
  data?: Map<string, BibliographyItem>
}

class GlobalLibraryItemsData extends DataComponent<
  BibliographyItem,
  Props,
  State
> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<BibliographyItem>(
      'libraryitems' // global library items and collections
    )
  }

  public componentDidMount() {
    this.sub = this.subscribe()
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  private subscribe = () =>
    this.collection
      .find({
        objectType: ObjectTypes.BibliographyItem,
      })
      .$.subscribe((docs) => {
        if (docs) {
          const data: Map<string, BibliographyItem> = new Map()

          for (const doc of docs) {
            data.set(doc._id, doc.toJSON())
          }

          this.setState({ data })
        }
      })
}

export default GlobalLibraryItemsData
