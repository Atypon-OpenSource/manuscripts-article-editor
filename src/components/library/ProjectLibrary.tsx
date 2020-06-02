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
  LibraryCollection,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React, { useCallback, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { filterLibrary } from '../../lib/library'
import { Collection } from '../../sync/Collection'
import { Main } from '../Page'
import Panel from '../Panel'
import { ResizingInspectorButton } from '../ResizerButtons'
import LibraryForm from './LibraryForm'
import { LibraryItems } from './LibraryItems'

const LibraryFormContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`

export const ProjectLibrary: React.FC<RouteComponentProps<{
  projectID: string
  filterID?: string
}> & {
  debouncedQuery?: string
  projectLibraryCollections: Map<string, LibraryCollection>
  projectLibraryCollectionsCollection: Collection<LibraryCollection>
  projectLibrary: Map<string, BibliographyItem>
  projectLibraryCollection: Collection<BibliographyItem>
  query?: string
  setQuery: (query: string) => void
  selectedItem?: BibliographyItem
  setSelectedItem: (item?: BibliographyItem) => void
  user: UserProfile
}> = React.memo(
  ({
    match: {
      params: { projectID, filterID },
    },
    projectLibraryCollections,
    projectLibraryCollectionsCollection,
    projectLibrary,
    projectLibraryCollection,
    user,
    query,
    setQuery,
    selectedItem,
    setSelectedItem,
  }) => {
    const [filteredItems, setFilteredItems] = useState<BibliographyItem[]>([])

    useEffect(() => {
      filterLibrary(
        projectLibrary,
        query,
        filterID ? new Set([filterID]) : undefined
      )
        .then(filteredItems => {
          filteredItems.sort(
            (a, b) => Number(b.updatedAt) - Number(a.updatedAt)
          )

          setFilteredItems(filteredItems)
        })
        .catch(error => {
          console.error(error) // tslint:disable-line:no-console
        })
    }, [filterID, projectLibrary, query])

    const handleSave = useCallback(
      (item: BibliographyItem): Promise<void> =>
        projectLibraryCollection.update(item._id, item).then(() => {
          setSelectedItem(undefined)
        }),
      [projectLibraryCollection]
    )

    const handleDelete = useCallback(
      (item: BibliographyItem): Promise<string | boolean> => {
        if (!window.confirm('Remove this item from the project library?')) {
          return Promise.resolve(false)
        }

        return projectLibraryCollection
          .delete(item._id)
          .then(() => {
            // this.setState({
            //   item: null,
            // })
            // TODO: change route
          })
          .then(() => {
            setSelectedItem(undefined)
            return item._id
          })
      },
      [projectLibraryCollection]
    )

    return (
      <>
        <Main>
          <LibraryItems
            query={query}
            setQuery={setQuery}
            handleSelect={setSelectedItem}
            hasItem={() => true}
            items={filteredItems}
            filterID={filterID}
            projectLibraryCollections={projectLibraryCollections}
            selectedItem={selectedItem}
          />
        </Main>

        <Panel
          name={'libraryItem'}
          side={'start'}
          direction={'row'}
          minSize={300}
          resizerButton={ResizingInspectorButton}
        >
          {selectedItem && (
            <LibraryFormContainer>
              <LibraryForm
                item={selectedItem}
                handleSave={handleSave}
                handleDelete={handleDelete}
                projectID={projectID}
                projectLibraryCollections={projectLibraryCollections}
                projectLibraryCollectionsCollection={
                  projectLibraryCollectionsCollection
                }
                user={user}
              />
            </LibraryFormContainer>
          )}
        </Panel>
      </>
    )
  }
)
