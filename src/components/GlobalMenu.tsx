import NavIcon from '@manuscripts/assets/react/NavIcon'
import React from 'react'
import ProjectsDropdownButton from '../containers/ProjectsDropdownButton'
import UserContainer from '../containers/UserContainer'
import {
  MenuBarIcon,
  MenuContainer,
  MenuLink,
  MenuSection,
  MenuSections,
} from './Menu'
import { UpdatesContainer } from './UpdatesContainer'

interface Props {
  active: string
}

export const GlobalMenu: React.SFC<Props> = ({ active }) => (
  <MenuContainer>
    <UpdatesContainer>
      <MenuBarIcon>
        <NavIcon />
      </MenuBarIcon>
    </UpdatesContainer>
    <MenuSections>
      <MenuSection>
        {active === 'projects' ? (
          <MenuLink to={`/projects`}>Projects</MenuLink>
        ) : (
          <ProjectsDropdownButton />
        )}

        {/* <MenuLink to={`/people`}>People</MenuLink> */}
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
