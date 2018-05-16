import qs from 'qs'
import React from 'react'
import { NavLink } from 'react-router-dom'
import Panel from '../components/Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import { styled } from '../theme'
import { LibrarySource } from '../types/library'

const SourceLink = styled(NavLink)`
  display: block;
  text-decoration: none;
  padding: 10px;
  cursor: pointer;
  color: inherit;

  &:hover {
    color: #5fa2ff;
  }
`

interface Props {
  sources: LibrarySource[]
}

const LibrarySidebar: React.SFC<Props> = ({ sources }) => (
  <Panel name={'librarySidebar'} minSize={200} direction={'row'} side={'end'}>
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle>Library</SidebarTitle>
      </SidebarHeader>
      <SidebarContent>
        {sources.map(source => (
          <SourceLink
            key={source.id}
            to={{
              pathname: '/library',
              search: qs.stringify({ source: source.id }),
            }}
            activeStyle={{
              background: '#65a3ff',
              color: 'white',
            }}
            isActive={(match, location) => {
              const query = qs.parse(location.search.substr(1))
              if (!query.source) return source.id === 'library'
              return query.source === source.id
            }}
          >
            {source.name}
          </SourceLink>
        ))}
      </SidebarContent>
    </Sidebar>
  </Panel>
)

export default LibrarySidebar
