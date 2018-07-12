import React from 'react'
import ProjectsMenu from '../containers/ProjectsMenu'
import UserContainer from '../containers/UserContainer'
import Nav from '../icons/nav'
import {
  MenuBarIcon,
  MenuContainer,
  MenuLink,
  MenuSection,
  MenuSections,
} from './Menu'
import MenuDropdown from './MenuDropdown'

export const GlobalMenu: React.SFC = () => (
  <MenuContainer>
    <MenuBarIcon>
      <Nav />
    </MenuBarIcon>
    <MenuSections>
      <MenuSection>
        <MenuDropdown
          id="globalmenu"
          buttonContents={<MenuLink to={'/projects'}>Projects</MenuLink>}
        >
          <ProjectsMenu />
        </MenuDropdown>

        <MenuLink to={`/people`}>People</MenuLink>
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
