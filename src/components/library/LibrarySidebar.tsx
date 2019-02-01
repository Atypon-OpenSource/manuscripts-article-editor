import qs from 'qs'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { LibrarySource } from '../../lib/sources'
import { styled } from '../../theme/styled-components'
import Panel from '../Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../Sidebar'

const SourceLink = styled(NavLink)`
  display: block;
  text-decoration: none;
  padding: 10px 20px;
  cursor: pointer;
  color: inherit;
  margin: 0 -20px;

  &:hover {
    background-color: ${props =>
      props.theme.colors.sidebar.background.selected};
  }
`

interface Props {
  projectID: string
  sources: LibrarySource[]
}

const LibrarySidebar: React.FunctionComponent<Props> = ({
  projectID,
  sources,
}) => (
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
              pathname: `/projects/${projectID}/library`,
              search: qs.stringify({ source: source.id }),
            }}
            activeStyle={{
              background: '#7fb5d5',
              color: '#fff',
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
