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
  BibliographyItem,
  Library,
  LibraryCollection,
} from '@manuscripts/json-schema'
import { Build } from '@manuscripts/transform'
import React from 'react'
import styled from 'styled-components'

import { sources } from '../../lib/sources'
import { useStore } from '../../store'
import { AddButton } from '../AddButton'
import PageSidebar from '../PageSidebar'
import { SidebarHeader } from '../Sidebar'
import { BibliographyImportButton } from './BibliographyImportButton'
import {
  DEFAULT_LIBRARY_COLLECTION_CATEGORY,
  sidebarIcon,
  sortByCategoryPriority,
} from './LibraryCollectionCategories'

const SectionContainer = styled.div`
  margin: 0 -${(props) => props.theme.grid.unit * 5}px ${(props) => props.theme.grid.unit * 4}px;
`

const SectionIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SectionTitle = styled.div`
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  flex: 1;
`

const ListTitle = styled.div`
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  flex: 1;
`

const SectionLink = styled.button`
  background: transparent;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-right: none;
  font-size: inherit;
  font-family: inherit;
  align-items: center;
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
  color: ${(props) => props.theme.colors.text.secondary};
  display: flex;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 9}px;
  line-height: 1;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: background-color 0.25s;
  white-space: nowrap;

  &:hover,
  &.active {
    background-color: ${(props) => props.theme.colors.background.fifth};
  }

  &.active {
    border-color: ${(props) => props.theme.colors.border.primary};
  }

  &:hover + &.active,
  &.active + &:hover {
    border-top-color: transparent;
  }
`

const SectionTitleLink = styled(SectionLink)`
  color: ${(props) => props.theme.colors.text.primary};
  padding: 7px ${(props) => props.theme.grid.unit * 4}px;
`

export const LibrarySidebar: React.FC<{
  projectLibraryCollections: Map<string, LibraryCollection>
  globalLibraries: Map<string, Library>
  globalLibraryCollections: Map<string, LibraryCollection>
  importItems: (
    items: Array<Build<BibliographyItem>>
  ) => Promise<BibliographyItem[]>
  createBibliographyItem: () => void
}> = ({
  projectLibraryCollections,
  globalLibraries,
  globalLibraryCollections,
  importItems,
  createBibliographyItem,
}) => {
  const globalLibrariesArray = Array.from(globalLibraries.values())
  const globalLibraryCollectionsArray = Array.from(
    globalLibraryCollections.values()
  )
  const projectLibraryCollectionsArray = Array.from(
    projectLibraryCollections.values()
  )

  const [, dispatch] = useStore()
  const [projectID] = useStore<string>((store) => store.libraryProjectID)
  const [sourceID] = useStore<string>((store) => store.librarySourceID)
  const [sourceType] = useStore<string>((store) => store.sourceType || '')

  globalLibraryCollectionsArray.sort(sortByCategoryPriority)

  // TODO: sort projectLibraryCollectionsArray by count, filter out empty

  return (
    <PageSidebar
      direction={'row'}
      minSize={260}
      name={'librarySidebar'}
      side={'end'}
      sidebarTitle={<SidebarHeader title={'Library'} />}
      sidebarFooter={
        <div>
          <FooterItem>
            <AddButton
              action={createBibliographyItem}
              title={'Create new library item'}
              size={'small'}
            />
          </FooterItem>
          <FooterItem>
            <BibliographyImportButton
              importItems={importItems}
              component={ImportButton}
            />
          </FooterItem>
        </div>
      }
    >
      <Section
        title={'Project Library'}
        open={sourceType === 'project'}
        onClick={() => {
          dispatch({
            libraryProjectID: projectID,
            libraryFilterID: '',
            sourceType: 'project',
          })
        }}
      >
        {projectLibraryCollectionsArray.map((projectLibraryCollection) => {
          // TODO: count items with this LibraryCollection and only show LibraryCollections with items

          return (
            <SectionLink
              key={projectLibraryCollection._id}
              onClick={() => {
                dispatch({
                  libraryProjectID: projectID,
                  libraryFilterID: projectLibraryCollection._id,
                  sourceType: 'project',
                })
              }}
            >
              {projectLibraryCollection.name || 'Untitled List'}
            </SectionLink>
          )
        })}
      </Section>

      {globalLibrariesArray.map((globalLibrary) => {
        const libraryCollections = globalLibraryCollectionsArray.filter(
          (libraryCollection) => {
            return libraryCollection.containerID === globalLibrary._id
          }
        )

        const defaultLibraryCollection = libraryCollections.find(
          (libraryCollection) =>
            libraryCollection.category === DEFAULT_LIBRARY_COLLECTION_CATEGORY
        )

        const nonDefaultLibraryCollections = libraryCollections.filter(
          (libraryCollection) =>
            libraryCollection.category !== DEFAULT_LIBRARY_COLLECTION_CATEGORY
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
            onClick={() => {
              dispatch({
                libraryProjectID: projectID,
                librarySourceID: globalLibrary._id,
                libraryFilterID: defaultFilter,
                sourceType: 'global',
              })
            }}
          >
            {nonDefaultLibraryCollections.map((libraryCollection) => (
              <SectionLink
                key={libraryCollection._id}
                onClick={() => {
                  dispatch({
                    libraryProjectID: projectID,
                    librarySourceID: globalLibrary._id,
                    libraryFilterID: libraryCollection._id,
                    sourceType: 'global',
                  })
                }}
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
        title={'Search Online'}
        open={sourceType === 'search'}
        onClick={() => {
          dispatch({
            libraryProjectID: projectID,
            librarySourceID: 'crossref',
            sourceType: 'search',
          })
        }}
      >
        {sources.map((source) => (
          <SectionLink
            key={source.id}
            onClick={() => {
              dispatch({
                libraryProjectID: projectID,
                librarySourceID: source.id,
                sourceType: 'search',
              })
            }}
          >
            {source.name}
          </SectionLink>
        ))}
      </Section>
    </PageSidebar>
  )
}

const ImportButton: React.FC<{
  importItems: () => void
}> = ({ importItems }) => (
  <AddButton action={importItems} title="Import from file" size={'small'} />
)

const Section: React.FC<{
  open: boolean
  onClick: () => void
  title: string
}> = ({ children, open, onClick, title }) => (
  <SectionContainer>
    <SectionTitleLink onClick={onClick} className={open ? 'active' : ''}>
      {open ? <TriangleExpanded /> : <TriangleCollapsed />}
      <SectionTitle>{title}</SectionTitle>
    </SectionTitleLink>

    {open && children}
  </SectionContainer>
)

const FooterItem = styled.div`
  margin-top: 8px;
`
