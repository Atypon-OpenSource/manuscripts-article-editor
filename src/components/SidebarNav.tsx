import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '../theme'
import {
  CollaboratorsTitleMessage,
  GroupsTitleMessage,
  ManuscriptsTitleMessage,
} from './Messages'

// type LinkProps = ThemedStyledProps<
//   React.HTMLProps<HTMLAnchorElement>,
//   Theme
// >

export const SidebarLink = styled(NavLink)`
  display: block;
  color: inherit;
  padding: 6px 20px;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  border-radius: 6px;
  margin: 6px 20px;
  overflow-x: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: white;
    background-color: #91c4ff;
  }
`

const SidebarNav: React.SFC = () => (
  <div>
    <SidebarLink to={'/manuscripts'}>
      <ManuscriptsTitleMessage />
    </SidebarLink>
    <SidebarLink to={'/collaborators'}>
      <CollaboratorsTitleMessage />
    </SidebarLink>
    <SidebarLink to={'/groups'}>
      <GroupsTitleMessage />
    </SidebarLink>
  </div>
)

export default SidebarNav
