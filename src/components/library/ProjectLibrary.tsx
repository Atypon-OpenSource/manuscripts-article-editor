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
import { useStore } from '../../store'

import { filterLibrary } from '../../lib/search-library'
import { Main } from '../Page'
import Panel from '../Panel'
import { ResizingInspectorButton } from '../ResizerButtons'
import LibraryForm from './LibraryForm'
import { LibraryItems } from './LibraryItems'

export const ProjectLibrary: React.FC<{
  debouncedQuery?: string
  projectLibraryCollections: Map<string, LibraryCollection>
  projectLibrary: Map<string, BibliographyItem>
  query?: string
  setQuery: (query: string) => void
  selectedItem?: BibliographyItem
  setSelectedItem: (item?: BibliographyItem) => void
  user: UserProfile
}> = React.memo(
  ({
    projectLibraryCollections,
    projectLibrary,
    user,
    query,
    setQuery,
    selectedItem,
    setSelectedItem,
  }) => {
    const [filteredItems, setFilteredItems] = useState<BibliographyItem[]>([])
    const [{ updateBiblioItem, deleteBiblioItem }] = useStore((store) => ({
      deleteBiblioItem: store.deleteBiblioItem,
      updateBiblioItem: store.updateBiblioItem,
    }))

    const [filterID] = useStore<string>((store) => store.libraryFilterID || '')

    useEffect(() => {
      filterLibrary(
        projectLibrary,
        query,
        filterID ? new Set([filterID]) : undefined
      )
        .then((filteredItems) => {
          filteredItems.sort(
            (a, b) => Number(b.updatedAt) - Number(a.updatedAt)
          )

          setFilteredItems(filteredItems)
        })
        .catch((error) => {
          console.error(error)
        })
    }, [filterID, projectLibrary, query])

    const handleSave = useCallback(
      (item: BibliographyItem): Promise<void> => {
        // @ts-ignore https://github.com/jaredpalmer/formik/issues/2180
        if (item.issued === '') {
          item.issued = undefined
        }

        return updateBiblioItem(item).then(() => {
          setSelectedItem(undefined)
        })
      },
      [updateBiblioItem, setSelectedItem]
    )

    const handleDelete = useCallback(
      (item: BibliographyItem): Promise<string | boolean> => {
        if (!window.confirm('Remove this item from the project library?')) {
          return Promise.resolve(false)
        }

        return deleteBiblioItem(item)
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
      [deleteBiblioItem, setSelectedItem]
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
            <LibraryForm
              key={selectedItem._id}
              item={selectedItem}
              handleSave={handleSave}
              handleDelete={handleDelete}
              user={user}
            />
          )}
        </Panel>
      </>
    )
  }
)
