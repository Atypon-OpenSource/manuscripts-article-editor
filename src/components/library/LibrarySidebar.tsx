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

import TriangleExpanded from '@manuscripts/assets/react/TriangleExpanded'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { LocationDescriptor } from 'history'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { filterLibrary } from '../../lib/library'
import { LibrarySource } from '../../lib/sources'
import { styled } from '../../theme/styled-components'
import Panel from '../Panel'
import { Sidebar, SidebarContent } from '../Sidebar'
import LibraryLists from './LibraryLists'

const StyledTriangleExpanded = styled(TriangleExpanded)<{ isVisible: boolean }>`
  display: inline-block;
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
`

const BlockWrapper = styled.div`
  display: none;
`

const SourceLink = styled(NavLink)`
  display: block;
  text-decoration: none;
  padding: 5px 0px 0px 20px;
  cursor: pointer;
  margin: 0 -20px;
  font-size: 18px;
  height: 25px;
  color: ${props => props.theme.colors.sidebar.text.primary};
  flex: 1;
  white-space: nowrap;

  &:hover {
    background-color: ${props =>
      props.theme.colors.library.sidebar.background.selected};
  }

  &.active {
    background-color: ${props =>
      props.theme.colors.library.sidebar.background.selected};
    color: #000000;
  }

  &.active ${StyledTriangleExpanded} {
    visibility: visible;
  }

  &.active + ${BlockWrapper} {
    display: block;
  }
`
const NavIcon = styled.div<{ source: LibrarySource }>`
  padding-right: 5px;
  padding-left: ${props => (props.source.parent ? '35px' : '5px')};
  display: inline-block;
`

const StyledSidebar = styled(Sidebar)`
  background: ${props => props.theme.colors.global.background.default};
`

interface NavProps {
  projectID: string
  source: LibrarySource
  clearKeywords: () => void
  sources: LibrarySource[]
  handleQuery: (query: string) => void
  handleKeyword: (keyword: string) => void
  library: Map<string, BibliographyItem>
  selectedKeywords?: Set<string>
  searchType?: string
  isSearch: boolean
}

const createLocation = (source: LibrarySource, projectID: string) => {
  const location: LocationDescriptor = {}
  const pathname = source.parent
    ? `/projects/${projectID}/library/search/${source.id}`
    : `/projects/${projectID}/library/${source.id}`
  location.pathname = pathname
  return location
}

const NavElement: React.FC<NavProps> = ({
  projectID,
  source,
  clearKeywords,
  sources,
  handleQuery,
  handleKeyword,
  library,
  selectedKeywords,
  isSearch,
}) => {
  let libraryLists = <div />
  if (source.id === 'library') {
    libraryLists = (
      <BlockWrapper>
        <LibraryLists
          items={filterLibrary(library, '')}
          projectID={projectID}
          handleQuery={handleQuery}
          handleKeyword={handleKeyword}
          selectedKeywords={selectedKeywords}
        />
      </BlockWrapper>
    )
  }

  const sourceLink = (
    <SourceLink
      to={createLocation(source, projectID)}
      isActive={(match, location) => {
        if (source.id === 'crossref') {
          return (
            !!match ||
            location.pathname.endsWith(source.id) ||
            location.pathname.endsWith('search')
          )
        }
        return !!match || location.pathname.endsWith(source.id)
      }}
      onClick={() => {
        clearKeywords()
      }}
      exact={false}
    >
      {(source.id === 'library' || source.id === 'search') && (
        <StyledTriangleExpanded isVisible={false} />
      )}
      <NavIcon source={source}>{source.icon && <source.icon />}</NavIcon>
      {source.name}
    </SourceLink>
  )
  return (
    <div style={{ width: '200px' }}>
      {(source.id === 'library' || source.id === 'search' || isSearch) &&
        sourceLink}
      {libraryLists}
    </div>
  )
}

interface Props {
  projectID: string
  sources: LibrarySource[]
  handleQuery: (query: string) => void
  clearKeywords: () => void
  handleKeyword: (keyword: string) => void
  library: Map<string, BibliographyItem>
  selectedKeywords?: Set<string>
  isSearch: boolean
}

const LibrarySidebar: React.FC<Props> = ({
  projectID,
  sources,
  handleQuery,
  clearKeywords,
  handleKeyword,
  library,
  selectedKeywords,
  isSearch,
}) => (
  <Panel name={'librarySidebar'} minSize={200} direction={'row'} side={'end'}>
    <StyledSidebar>
      <SidebarContent>
        {sources.map(source => (
          <NavElement
            key={source.id}
            projectID={projectID}
            source={source}
            clearKeywords={clearKeywords}
            sources={sources}
            handleQuery={handleQuery}
            handleKeyword={handleKeyword}
            library={library}
            selectedKeywords={selectedKeywords}
            isSearch={isSearch}
          />
        ))}
      </SidebarContent>
    </StyledSidebar>
  </Panel>
)

export default LibrarySidebar
