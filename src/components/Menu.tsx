import React from 'react'
import { NavLink } from 'react-router-dom'
import ProjectsDropdownButton from '../containers/ProjectsDropdownButton'
import UserContainer from '../containers/UserContainer'
import Close from '../icons/close'
import { styled } from '../theme'
import { DeveloperMenu } from './DeveloperMenu'
import MenuDropdown from './MenuDropdown'

export const MenuContainer = styled.div`
  display: flex;
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
  background: white;
  border: none;
  cursor: pointer;
  color: #7fb5d5;

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

  &:hover,
  &.active {
    background: #7fb5d5;
    color: white;
  }
`

interface Props {
  handleClose: React.MouseEventHandler<HTMLElement>
  projectID: string
}

export const Menu: React.SFC<Props> = ({ handleClose, projectID }) => (
  <MenuContainer>
    <MenuBarIcon onClick={handleClose}>
      <Close size={16} color={''} />
    </MenuBarIcon>
    <MenuSections>
      <MenuSection>
        <ProjectsDropdownButton />
        <MenuLink to={`/projects/${projectID}/contributors`}>People</MenuLink>
        <MenuLink to={`/projects/${projectID}/library`}>Library</MenuLink>

        <MenuDropdown id={'developer-dropdown'} buttonContents={'Developer'}>
          <DeveloperMenu />
        </MenuDropdown>
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
