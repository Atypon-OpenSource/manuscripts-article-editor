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

import MyPublications from '@manuscripts/assets/react/MyPublications'
import Paragraph from '@manuscripts/assets/react/Paragraph'
import Star from '@manuscripts/assets/react/Star'
import Target from '@manuscripts/assets/react/Target'
import Time from '@manuscripts/assets/react/Time'
import { LibraryCollection } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

type LibraryCollectionCategory =
  | 'MPLibraryCollectionCategory:default'
  | 'MPLibraryCollectionCategory:favourites'
  | 'MPLibraryCollectionCategory:read-later'
  | 'MPLibraryCollectionCategory:watch-list'
  | 'MPLibraryCollectionCategory:my-publications'

export const DEFAULT_LIBRARY_COLLECTION_CATEGORY =
  'MPLibraryCollectionCategory:default'

const icons: { [key in LibraryCollectionCategory]: JSX.Element } = {
  'MPLibraryCollectionCategory:default': <Paragraph width={18} height={18} />,
  'MPLibraryCollectionCategory:favourites': <Star width={18} height={18} />,
  'MPLibraryCollectionCategory:read-later': <Time width={18} height={18} />,
  'MPLibraryCollectionCategory:watch-list': <Target width={18} height={18} />,
  'MPLibraryCollectionCategory:my-publications': (
    <MyPublications width={18} height={18} />
  ),
}

export const sidebarIcon = (key?: string) =>
  key && key in icons
    ? icons[key as LibraryCollectionCategory]
    : icons[DEFAULT_LIBRARY_COLLECTION_CATEGORY]

const priorities: { [key in LibraryCollectionCategory]: number } = {
  'MPLibraryCollectionCategory:default': 5,
  'MPLibraryCollectionCategory:my-publications': 4,
  'MPLibraryCollectionCategory:favourites': 3,
  'MPLibraryCollectionCategory:read-later': 2,
  'MPLibraryCollectionCategory:watch-list': 1,
}

export const sortByCategoryPriority = (
  a: LibraryCollection,
  b: LibraryCollection
) => {
  const priorityA =
    a.category && a.category in priorities
      ? priorities[a.category as LibraryCollectionCategory]
      : 0

  const priorityB =
    b.category && b.category in priorities
      ? priorities[b.category as LibraryCollectionCategory]
      : 0

  return priorityB - priorityA
}
