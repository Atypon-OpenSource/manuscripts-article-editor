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

import TriangleCollapsed from '@manuscripts/assets/react/TriangleCollapsed'
import TriangleExpanded from '@manuscripts/assets/react/TriangleExpanded'
import {
  Library,
  LibraryCollection,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { sources } from '../../lib/sources'
import { styled } from '../../theme/styled-components'
import Panel from '../Panel'
import { Sidebar, SidebarContent } from '../Sidebar'
import {
  DEFAULT_LIBRARY_COLLECTION_CATEGORY,
  sidebarIcon,
  sortByCategoryPriority,
} from './LibraryCollectionCategories'

const SectionContainer = styled.div`
  margin-bottom: 16px;
`

const StyledSidebar = styled(Sidebar)`
  background: ${props => props.theme.colors.global.background.default};
  padding: 16px 0;

  ${SidebarContent} {
    padding: 0;
  }
`

const SectionIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SectionTitle = styled.div`
  margin-left: 8px;
  flex: 1;
`

const ListTitle = styled.div`
  margin-left: 8px;
  flex: 1;
`

const SectionLink = styled(NavLink)`
  text-decoration: none;
  color: #777;
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 36px;
  transition: background-color 0.25s;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1;
  overflow: hidden;

  &.active {
    background-color: #e4eef7;
  }

  &:hover {
    background-color: #e4eef7;
  }
`

const SectionTitleLink = styled(SectionLink)`
  color: #444;
  padding: 8px 16px;
  margin-left: 0;
`

export const LibrarySidebar: React.FC<
  RouteComponentProps<{
    projectID: string
    sourceType: string
    sourceID?: string
    filterID?: string
  }> & {
    projectLibraryCollections: Map<string, LibraryCollection>
    globalLibraries: Map<string, Library>
    globalLibraryCollections: Map<string, LibraryCollection>
  }
> = ({
  projectLibraryCollections,
  globalLibraries,
  globalLibraryCollections,
  match: {
    params: { projectID, sourceID, sourceType },
  },
}) => {
  const globalLibrariesArray = Array.from(globalLibraries.values())
  const globalLibraryCollectionsArray = Array.from(
    globalLibraryCollections.values()
  )
  const projectLibraryCollectionsArray = Array.from(
    projectLibraryCollections.values()
  )

  globalLibraryCollectionsArray.sort(sortByCategoryPriority)

  // TODO: sort projectLibraryCollectionsArray by count, filter out empty

  return (
    <Panel name={'librarySidebar'} minSize={200} direction={'row'} side={'end'}>
      <StyledSidebar>
        <SidebarContent>
          <Section
            title={'Project Library'}
            open={sourceType === 'project'}
            location={`/projects/${projectID}/library/project`}
          >
            {projectLibraryCollectionsArray.map(projectLibraryCollection => {
              // TODO: count items with this LibraryCollection and only show LibraryCollections with items

              return (
                <SectionLink
                  key={projectLibraryCollection._id}
                  to={`/projects/${projectID}/library/project/${projectLibraryCollection._id}`}
                >
                  {projectLibraryCollection.name || 'Untitled List'}
                </SectionLink>
              )
            })}
          </Section>

          {globalLibrariesArray.map(globalLibrary => {
            const libraryCollections = globalLibraryCollectionsArray.filter(
              libraryCollection => {
                return libraryCollection.containerID === globalLibrary._id
              }
            )

            const defaultLibraryCollection = libraryCollections.find(
              libraryCollection =>
                libraryCollection.category ===
                DEFAULT_LIBRARY_COLLECTION_CATEGORY
            )

            const nonDefaultLibraryCollections = libraryCollections.filter(
              libraryCollection =>
                libraryCollection.category !==
                DEFAULT_LIBRARY_COLLECTION_CATEGORY
            )

            const defaultFilter = defaultLibraryCollection
              ? `/${defaultLibraryCollection._id}`
              : ''

            return (
              <Section
                key={globalLibrary._id}
                title={globalLibrary.name || 'My Library'}
                open={
                  sourceType === 'global' &&
                  sourceID === globalLibrary._id &&
                  nonDefaultLibraryCollections.length > 0
                }
                location={`/projects/${projectID}/library/global/${globalLibrary._id}${defaultFilter}`}
              >
                {nonDefaultLibraryCollections.map(libraryCollection => (
                  <SectionLink
                    key={libraryCollection._id}
                    to={`/projects/${projectID}/library/global/${globalLibrary._id}/${libraryCollection._id}`}
                  >
                    <SectionIcon>
                      {sidebarIcon(libraryCollection.category)}
                    </SectionIcon>
                    <ListTitle>
                      {libraryCollection.name || 'Untitled List'}
                    </ListTitle>
                  </SectionLink>
                ))}
              </Section>
            )
          })}

          <Section
            title={'Search'}
            open={sourceType === 'search'}
            location={`/projects/${projectID}/library/search`}
          >
            {sources.map(source => (
              <SectionLink
                key={source.id}
                to={`/projects/${projectID}/library/search/${source.id}`}
              >
                {source.name}
              </SectionLink>
            ))}
          </Section>
        </SidebarContent>
      </StyledSidebar>
    </Panel>
  )
}

export const LibrarySidebarWithRouter = withRouter(LibrarySidebar)

const Section: React.FC<{
  open: boolean
  location: string
  title: string
}> = ({ children, open, location, title }) => (
  <SectionContainer>
    <SectionTitleLink to={location} exact={true}>
      {open ? <TriangleExpanded /> : <TriangleCollapsed />}
      <SectionTitle>{title}</SectionTitle>
    </SectionTitleLink>

    {open && children}
  </SectionContainer>
)
