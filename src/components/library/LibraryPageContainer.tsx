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

import { buildBibliographyItem } from '@manuscripts/manuscript-transform'
import { BibliographyItem, Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router'
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
  selectedKeywords: Set<string>
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

export type LibraryPageContainerComponent = React.ComponentType<Props>

class LibraryPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    item: null,
    items: null,
    query: null,
    source: 'library',
    selectedKeywords: new Set<string>(),
  }

  public componentDidMount() {
    this.setSource(this.props)
  }

  public componentWillReceiveProps(nextProps: CombinedProps) {
    this.setSource(nextProps)
  }

  public render() {
    const { source, query, selectedKeywords } = this.state
    const { library, project } = this.props

    if (!source || !project) return null

    const librarySource = sources.find(item => item.id === source)

    if (!librarySource) return null

    return (
      <>
        <Switch>
          <Route
            path={'/projects/:projectID/library/library'}
            exact={true}
            render={() => (
              <LibrarySidebar
                projectID={project._id}
                sources={sources}
                library={library}
                handleKeyword={value => {
                  if (value) {
                    if (selectedKeywords.has(value)) {
                      selectedKeywords.delete(value)
                    } else {
                      selectedKeywords.add(value)
                    }
                    this.setState({
                      selectedKeywords,
                    })
                  }
                }}
                clearKeywords={() => {
                  selectedKeywords.clear()
                }}
                selectedKeywords={selectedKeywords}
                isSearch={false}
              />
            )}
          />
          <Route
            path={'/projects/:projectID/library/search'}
            exact={false}
            render={() => (
              <LibrarySidebar
                projectID={project._id}
                sources={sources}
                library={library}
                handleKeyword={value => {
                  if (value) {
                    if (selectedKeywords.has(value)) {
                      selectedKeywords.delete(value)
                    } else {
                      selectedKeywords.add(value)
                    }
                    this.setState({
                      selectedKeywords,
                    })
                  }
                }}
                clearKeywords={() => {
                  selectedKeywords.clear()
                }}
                selectedKeywords={selectedKeywords}
                isSearch={true}
              />
            )}
          />
        </Switch>
        {source === 'library' ? (
          <LibraryContainer
            library={library}
            handleQuery={value => {
              this.setState({
                query: value === query ? '' : value,
                selectedKeywords: new Set<string>(),
              })
            }}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
            projectID={project._id}
            query={this.state.query}
            selectedKeywords={this.state.selectedKeywords}
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
    if (location && location.pathname && location.pathname.lastIndexOf('/')) {
      this.setState({
        source:
          location.pathname.substring(location.pathname.lastIndexOf('/') + 1) ||
          'library',
      })
    }
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
