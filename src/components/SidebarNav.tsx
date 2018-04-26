import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '../theme'

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

const SidebarNav = () => (
  <div>
    <SidebarLink to={'/manuscripts'}>Manuscripts</SidebarLink>
    <SidebarLink to={'/collaborators'}>Collaborators</SidebarLink>
    <SidebarLink to={'/groups'}>Groups</SidebarLink>
  </div>
)

export default SidebarNav
