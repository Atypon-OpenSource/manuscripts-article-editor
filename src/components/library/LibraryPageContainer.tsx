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

import { buildBibliographyItem } from '@manuscripts/manuscript-editor'
import { BibliographyItem, Project } from '@manuscripts/manuscripts-json-schema'
import qs from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxDocument } from 'rxdb'
import { sources } from '../../lib/sources'
import { Collection } from '../../sync/Collection'
import LibraryContainer from './LibraryContainer'
import LibrarySidebar from './LibrarySidebar'
import LibrarySourceContainer from './LibrarySourceContainer'

interface State {
  item: BibliographyItem | null
  items: BibliographyItem[] | null
  query: string | null
  source: string
}

interface Props {
  library: Map<string, BibliographyItem>
  libraryCollection: Collection<BibliographyItem>
  project: Project
}

type CombinedProps = Props &
  RouteComponentProps<{
    projectID: string
  }>

class LibraryPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    item: null,
    items: null,
    query: null,
    source: 'library',
  }

  public componentDidMount() {
    this.setSource(this.props)
  }

  public componentWillReceiveProps(nextProps: CombinedProps) {
    this.setSource(nextProps)
  }

  public render() {
    const { source } = this.state
    const { library, project } = this.props

    if (!source || !project) return null

    const librarySource = sources.find(item => item.id === source)

    if (!librarySource) return null

    return (
      <>
        <LibrarySidebar projectID={project._id} sources={sources} />

        {source === 'library' ? (
          <LibraryContainer
            library={library}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
            projectID={project._id}
          />
        ) : (
          <LibrarySourceContainer
            source={librarySource}
            handleAdd={this.handleAdd}
            hasItem={this.hasItem}
          />
        )}
      </>
    )
  }

  private setSource(props: CombinedProps) {
    const location = props.location
    const query = qs.parse(location.search.substr(1))
    this.setState({
      source: query.source || 'library',
    })
  }

  private handleAdd = async (data: Partial<BibliographyItem>) => {
    const { projectID } = this.props.match.params

    const item = buildBibliographyItem(data)

    await this.props.libraryCollection.create(item, {
      containerID: projectID,
    })
  }

  private handleSave = (item: BibliographyItem) => {
    return this.props.libraryCollection.update(item._id, item)
  }

  private handleDelete = async (item: BibliographyItem): Promise<string> => {
    await this.props.libraryCollection.delete(item._id)

    this.setState({
      item: null,
    })

    return item._id
  }

  // TODO: move this to source definition
  private hasItem = (item: BibliographyItem): boolean => {
    const items = Array.from(this.props.library.values())

    return items.some(
      (libraryItem: RxDocument<BibliographyItem>) =>
        libraryItem.DOI === item.DOI
    )
  }
}

export default LibraryPageContainer
