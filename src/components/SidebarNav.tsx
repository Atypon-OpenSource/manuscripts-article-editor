import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { ThemedStyledProps } from 'styled-components'
import { styled, ThemeInterface } from '../theme'

type LinkProps = ThemedStyledProps<
  React.HTMLProps<HTMLAnchorElement>,
  ThemeInterface
>

const SidebarLink = styled(NavLink)`
  display: block;
  color: ${(props: LinkProps) => props.theme.primary};
  padding: 5px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
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
