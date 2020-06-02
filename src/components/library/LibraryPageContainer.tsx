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

import { Build, buildBibliographyItem } from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Library,
  LibraryCollection,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React, { useCallback, useState } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import { useDebounce } from '../../hooks/use-debounce'
import { matchLibraryItemByIdentifier } from '../../lib/bibliography'
import { Collection } from '../../sync/Collection'
import { ExternalSearch } from './ExternalSearch'
import { GlobalLibrary } from './GlobalLibrary'
import { LibrarySidebarWithRouter } from './LibrarySidebar'
import { ProjectLibrary } from './ProjectLibrary'

export interface LibraryPageContainerProps {
  globalLibraries: Map<string, Library>
  globalLibraryCollections: Map<string, LibraryCollection>
  globalLibraryItems: Map<string, BibliographyItem>
  project: Project
  projectLibrary: Map<string, BibliographyItem>
  projectLibraryCollection: Collection<BibliographyItem>
  projectLibraryCollections: Map<string, LibraryCollection>
  projectLibraryCollectionsCollection: Collection<LibraryCollection>
  user: UserProfile
}

export const LibraryPageContainer: React.FC<RouteComponentProps<{
  projectID: string
}> &
  LibraryPageContainerProps> = ({
  globalLibraries,
  globalLibraryCollections,
  globalLibraryItems,
  history,
  match: {
    params: { projectID },
  },
  projectLibrary,
  projectLibraryCollection,
  projectLibraryCollections,
  projectLibraryCollectionsCollection,
  user,
}) => {
  const [selectedItem, setSelectedItem] = useState<BibliographyItem>() // TODO: item in route?

  // TODO: should the query be part of the route?
  const [query, setQuery] = useState<string>()

  const debouncedQuery = useDebounce(query, 500)

  const importItems = async (items: Array<Build<BibliographyItem>>) => {
    const newItems: BibliographyItem[] = []

    for (const item of items) {
      const existingItem = matchLibraryItemByIdentifier(
        item as BibliographyItem,
        projectLibrary
      )

      if (!existingItem) {
        // add the item to the model map so it's definitely available
        projectLibrary.set(item._id, item as BibliographyItem)

        // save the new item
        const newItem = await projectLibraryCollection.create(item, {
          containerID: projectID,
        })
        newItems.push(newItem)
      }
    }

    return newItems
  }

  const createBibliographyItem = useCallback(() => {
    const item = buildBibliographyItem({})

    projectLibraryCollection
      .create(item, {
        containerID: projectID,
      })
      .then(item => {
        history.push(`/projects/${projectID}/library/project`)
        setSelectedItem(item)
      })
      .catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
  }, [projectLibraryCollection, projectID])

  return (
    <>
      <LibrarySidebarWithRouter
        projectLibraryCollections={projectLibraryCollections}
        globalLibraries={globalLibraries}
        globalLibraryCollections={globalLibraryCollections}
        importItems={importItems}
        createBibliographyItem={createBibliographyItem}
      />

      <Switch>
        <Redirect
          from={'/projects/:projectID/library'}
          exact={true}
          to={'/projects/:projectID/library/project'}
        />

        <Route
          path={'/projects/:projectID/library/project/:filterID?'}
          render={(
            props: RouteComponentProps<{
              projectID: string
              filterID?: string
            }>
          ) => (
            <ProjectLibrary
              projectLibraryCollections={projectLibraryCollections}
              projectLibraryCollectionsCollection={
                projectLibraryCollectionsCollection
              }
              projectLibrary={projectLibrary}
              projectLibraryCollection={projectLibraryCollection}
              user={user}
              query={query}
              setQuery={setQuery}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              debouncedQuery={debouncedQuery}
              {...props}
            />
          )}
        />

        <Route
          path={'/projects/:projectID/library/global/:sourceID/:filterID?'}
          render={(
            props: RouteComponentProps<{
              projectID: string
              sourceID: string
              filterID?: string
            }>
          ) => (
            <GlobalLibrary
              globalLibrary={globalLibraries.get(props.match.params.sourceID)}
              globalLibraryItems={globalLibraryItems}
              projectLibrary={projectLibrary}
              projectLibraryCollection={projectLibraryCollection}
              query={query}
              setQuery={setQuery}
              debouncedQuery={debouncedQuery}
              {...props}
            />
          )}
        />

        <Redirect
          from={'/projects/:projectID/library/search'}
          exact={true}
          to={'/projects/:projectID/library/search/crossref'}
        />

        <Route
          path={'/projects/:projectID/library/search/:sourceID?'}
          render={(
            props: RouteComponentProps<{
              projectID: string
              sourceID: string
            }>
          ) => (
            <ExternalSearch
              projectLibrary={projectLibrary}
              projectLibraryCollection={projectLibraryCollection}
              query={query}
              setQuery={setQuery}
              debouncedQuery={debouncedQuery}
              {...props}
            />
          )}
        />
      </Switch>
    </>
  )
}

export default LibraryPageContainer
