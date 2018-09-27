import NavIcon from '@manuscripts/assets/react/NavIcon'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { jellyBeanBlue, manuscriptsBlue } from '../colors'
import ProjectsDropdownButton from '../containers/ProjectsDropdownButton'
import UserContainer from '../containers/UserContainer'
import { styled } from '../theme'
import ViewIcon from './ViewIcon'

export const MenuContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  align-items: center;
  color: #949494;
  font-family: ${props => props.theme.fontFamily};
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  border-bottom: solid 1px #ddd;
`

export const MenuBarIcon = styled.button`
  height: 58px;
  width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #7fb5d5;
  font-size: inherit;

  &:focus {
    outline: none;
  }
`

export const MenuSections = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const MenuSection = styled.div`
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

  &.active {
    background: ${manuscriptsBlue};
    color: white;
  }

  &:hover {
    background: ${jellyBeanBlue};
    color: white;
  }
`

interface Props {
  handleClose: React.MouseEventHandler<HTMLElement>
  projectID: string
}

export const Menu: React.SFC<Props> = ({ handleClose, projectID }) => (
  <MenuContainer>
    <ViewIcon title={'Back to Editor'} tooltip={{ top: '80%', left: '20%' }}>
      <MenuBarIcon onClick={handleClose}>
        <NavIcon />
      </MenuBarIcon>
    </ViewIcon>

    <MenuSections>
      <MenuSection>
        <ProjectsDropdownButton />
        <MenuLink to={`/projects/${projectID}/collaborators`}>People</MenuLink>
        <MenuLink to={`/projects/${projectID}/library`}>Library</MenuLink>
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
