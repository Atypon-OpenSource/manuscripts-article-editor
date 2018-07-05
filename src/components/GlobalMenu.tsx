import React from 'react'
import UserContainer from '../containers/UserContainer'
import Nav from '../icons/nav'
import { styled } from '../theme'
import { MenuBarIcon, MenuContainer, MenuSection } from './Menu'

const MenuSections = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const GlobalMenu: React.SFC = () => (
  <MenuContainer>
    <MenuBarIcon>
      <Nav />
    </MenuBarIcon>
    <MenuSections>
      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
