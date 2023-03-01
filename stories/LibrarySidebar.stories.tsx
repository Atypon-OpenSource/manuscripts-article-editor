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

import { Library, LibraryCollection } from '@manuscripts/json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { createBrowserHistory } from 'history'
import React from 'react'

// TODO: re-enable routing once storybook-react-router is compatible
// import { Route, RouteComponentProps } from 'react-router'
// import StoryRouter from 'storybook-react-router'
import { LibrarySidebar } from '../src/components/library/LibrarySidebar'

const projectLibraryCollections = new Map<string, LibraryCollection>([
  [
    'MPLibraryCollection:1',
    {
      _id: 'MPLibraryCollection:1',
      objectType: 'MPLibraryCollection',
      containerID: 'MPProject:1',
      name: 'Examples',
      owners: ['User_foo@example.com'],
      writers: [],
      viewers: [],
      createdAt: 0,
      updatedAt: 0,
    },
  ],
])

const globalLibraries = new Map<string, Library>([
  [
    'MPLibrary:1',
    {
      _id: 'MPLibrary:1',
      objectType: 'MPLibrary',
      category: 'MPLibraryCategory:default',
      name: 'My Library',
      owners: ['User_foo@example.com'],
      writers: [],
      viewers: [],
      createdAt: 0,
      updatedAt: 0,
    },
  ],
])

const globalLibraryCollections = new Map<string, LibraryCollection>([
  [
    'MPLibraryCollection:2',
    {
      _id: 'MPLibraryCollection:2',
      objectType: 'MPLibraryCollection',
      containerID: 'MPLibrary:1',
      category: 'MPLibraryCollectionCategory:read-later',
      name: 'Read Later',
      owners: ['User_foo@example.com'],
      writers: [],
      viewers: [],
      createdAt: 0,
      updatedAt: 0,
    },
  ],
  [
    'MPLibraryCollection:3',
    {
      _id: 'MPLibraryCollection:3',
      objectType: 'MPLibraryCollection',
      containerID: 'MPLibrary:1',
      category: 'MPLibraryCollectionCategory:favourites',
      name: 'Favourites',
      owners: ['User_foo@example.com'],
      writers: [],
      viewers: [],
      createdAt: 0,
      updatedAt: 0,
    },
  ],
  [
    'MPLibraryCollection:4',
    {
      _id: 'MPLibraryCollection:4',
      objectType: 'MPLibraryCollection',
      containerID: 'MPLibrary:1',
      category: 'MPLibraryCollectionCategory:default',
      name: 'Default',
      owners: ['User_foo@example.com'],
      writers: [],
      viewers: [],
      createdAt: 0,
      updatedAt: 0,
    },
  ],
  [
    'MPLibraryCollection:5',
    {
      _id: 'MPLibraryCollection:5',
      objectType: 'MPLibraryCollection',
      containerID: 'MPLibrary:1',
      category: 'MPLibraryCollectionCategory:watch-list',
      name: 'Watch List',
      owners: ['User_foo@example.com'],
      writers: [],
      viewers: [],
      createdAt: 0,
      updatedAt: 0,
    },
  ],
  [
    'MPLibraryCollection:6',
    {
      _id: 'MPLibraryCollection:6',
      objectType: 'MPLibraryCollection',
      containerID: 'MPLibrary:1',
      category: 'MPLibraryCollectionCategory:my-publications',
      name: 'My Publications',
      owners: ['User_foo@example.com'],
      writers: [],
      viewers: [],
      createdAt: 0,
      updatedAt: 0,
    },
  ],
])

const routeProps = {
  history: createBrowserHistory(),
  match: {
    isExact: true,
    params: {
      projectID: 'MPProject:1',
      sourceType: 'library',
      sourceID: 'MPLibrary:1',
    },
    path: '',
    url: '',
  },
  location: {
    hash: '',
    pathname: '/projects/MPProject:1/library/global/MPLibrary:1',
    search: '',
    state: {},
  },
}

storiesOf('Library Sidebar', module).add('Sidebar', () => (
  <LibrarySidebar
    projectLibraryCollections={projectLibraryCollections}
    globalLibraryCollections={globalLibraryCollections}
    globalLibraries={globalLibraries}
    importItems={action('import items')}
    createBibliographyItem={action('create bibliography item')}
    {...routeProps}
  />
))

// storiesOf('Library Sidebar', module)
//   .addDecorator(
//     StoryRouter(
//       {},
//       {
//         initialEntries: [
//           {
//             pathname: `/projects/MPProject:1/library/global/MPLibrary:1`,
//           },
//         ],
//       }
//     )
//   )
//   .add('Sidebar', () => (
//     <Route
//       path={'/projects/:projectID/library/:sourceType?/:sourceID?/:filterID?'}
//       render={(
//         props: RouteComponentProps<{
//           projectID: string
//           sourceType: string
//           sourceID?: string
//         }>
//       ) => (
//         <LibrarySidebar
//           projectLibraryCollections={projectLibraryCollections}
//           globalLibraryCollections={globalLibraryCollections}
//           globalLibraries={globalLibraries}
//           importItems={action('import items')}
//           createBibliographyItem={action('create bibliography item')}
//           {...props}
//         />
//       )}
//     />
//   ))
