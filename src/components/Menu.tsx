import React from 'react'
import { NavLink } from 'react-router-dom'
import ProjectsMenu from '../containers/ProjectsMenu'
import UserContainer from '../containers/UserContainer'
import Close from '../icons/close'
import { styled } from '../theme'
import MenuDropdown from './MenuDropdown'

const MenuContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  color: #000;
  font-family: ${props => props.theme.fontFamily};
  white-space: nowrap;
`

export const MenuBarIcon = styled.button`
  height: 58px;
  width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  cursor: pointer;
  color: #7fb5d5;

  &:focus {
    outline: none;
  }
`

const MenuSections = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MenuSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`

export const MenuLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  text-decoration: none;
  color: inherit;
  border-radius: 4px;
  margin-left: 20px;

  &:hover {
    background: #7fb5d5;
    color: white;
  }
`

interface MenuProps {
  handleClose: React.MouseEventHandler<HTMLButtonElement>
}

export const Menu: React.SFC<MenuProps> = ({ handleClose }) => (
  <MenuContainer>
    <MenuBarIcon onClick={handleClose}>
      <Close size={16} color={''} />
    </MenuBarIcon>
    <MenuSections>
      <MenuSection>
        <MenuDropdown
          buttonContents={<MenuLink to={'/projects'}>Projects</MenuLink>}
        >
          <ProjectsMenu />
        </MenuDropdown>

        <MenuLink to={'/activity'}>Activity</MenuLink>
        <MenuLink to={'/plan'}>Plan</MenuLink>
        <MenuLink to={'/people'}>People</MenuLink>
        <MenuLink to={'/library'}>Library</MenuLink>
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
