import NavIcon from '@manuscripts/assets/react/NavIcon'
import React from 'react'
import {
  FilledMenuBarIcon,
  MenuContainer,
  MenuLink,
  MenuSection,
  MenuSections,
} from './Menu'
import ProjectsButton from './ProjectsButton'
import { UpdatesContainer } from './UpdatesContainer'
import UserContainer from './UserContainer'

interface Props {
  active: string
}

export const GlobalMenu: React.FunctionComponent<Props> = ({ active }) => (
  <MenuContainer>
    <UpdatesContainer>
      <FilledMenuBarIcon>
        <NavIcon />
      </FilledMenuBarIcon>
    </UpdatesContainer>
    <MenuSections>
      <MenuSection>
        {active === 'projects' ? (
          <MenuLink to={'/projects'}>Projects</MenuLink>
        ) : (
          <ProjectsButton isDropdown={true} />
        )}

        {/* <MenuLink to={`/people`}>People</MenuLink> */}
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
