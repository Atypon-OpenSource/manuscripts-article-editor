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

import { BibliographyItem } from '@manuscripts/json-schema'
import { matchLibraryItemByIdentifier } from '@manuscripts/library'
import { Build, buildBibliographyItem } from '@manuscripts/transform'
import React, { useCallback, useState } from 'react'

import { useDebounce } from '../../hooks/use-debounce'
import { useStore } from '../../store'
import { ExternalSearch } from './ExternalSearch'
import { GlobalLibrary } from './GlobalLibrary'
import { LibrarySidebar } from './LibrarySidebar'
import { ProjectLibrary } from './ProjectLibrary'

export const LibraryPageContainer: React.FC = () => {
  const [
    {
      projectID,
      user,
      globalLibraries,
      globalLibraryCollections,
      globalLibraryItems,
      projectLibrary,
      saveBiblioItem,
      projectLibraryCollections,
    },
  ] = useStore((store) => ({
    projectID: store.projectID,
    user: store.user,
    globalLibraries: store.globalLibraries || new Map(),
    globalLibraryCollections: store.globalLibraryCollections || new Map(),
    globalLibraryItems: store.globalLibraryItems || new Map(),
    projectLibrary: store.library, // ???
    saveBiblioItem: store.saveBiblioItem,
    projectLibraryCollections: store.projectLibraryCollections,
  }))
  const [selectedItem, setSelectedItem] = useState<BibliographyItem>() // TODO: item in route?

  const [sourceType, dispatch] = useStore<string>(
    (store) => store.sourceType || ''
  )

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
        const newItem = await saveBiblioItem(item, projectID)
        newItems.push(newItem)
      }
    }

    return newItems
  }

  const createBibliographyItem = useCallback(() => {
    const item = buildBibliographyItem({})
    saveBiblioItem(item, projectID)
      .then((item) => {
        dispatch({
          sourceType: 'project',
        })
        setSelectedItem(item)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [saveBiblioItem, projectID, dispatch])

  const switchView = () => {
    switch (sourceType) {
      case 'global':
        return (
          <GlobalLibrary
            globalLibraryItems={globalLibraryItems}
            projectLibrary={projectLibrary}
            query={query}
            setQuery={setQuery}
            debouncedQuery={debouncedQuery}
          />
        )
      case 'search':
        return (
          <ExternalSearch
            projectLibrary={projectLibrary}
            query={query}
            setQuery={setQuery}
            debouncedQuery={debouncedQuery}
          />
        )
      case 'project':
      default:
        return (
          <ProjectLibrary
            projectLibraryCollections={projectLibraryCollections}
            projectLibrary={projectLibrary}
            user={user}
            query={query}
            setQuery={setQuery}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            debouncedQuery={debouncedQuery}
          />
        )
    }
  }

  return (
    <>
      <LibrarySidebar
        projectLibraryCollections={projectLibraryCollections}
        globalLibraries={globalLibraries}
        globalLibraryCollections={globalLibraryCollections}
        importItems={importItems}
        createBibliographyItem={createBibliographyItem}
      />
      {switchView()}
    </>
  )
}

export default LibraryPageContainer
