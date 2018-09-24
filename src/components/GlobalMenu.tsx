import React from 'react'
import ProjectsDropdownButton from '../containers/ProjectsDropdownButton'
import UserContainer from '../containers/UserContainer'
import Nav from '../icons/nav'
import { MenuBarIcon, MenuContainer, MenuSection, MenuSections } from './Menu'

export const GlobalMenu: React.SFC = () => (
  <MenuContainer>
    <MenuBarIcon>
      <Nav />
    </MenuBarIcon>
    <MenuSections>
      <MenuSection>
        <ProjectsDropdownButton />
        {/* <MenuLink to={`/people`}>People</MenuLink> */}
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
