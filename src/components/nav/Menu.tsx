import NavIcon from '@manuscripts/assets/react/NavIcon'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { jellyBeanBlue, manuscriptsBlue } from '../../colors'
import { styled } from '../../theme'
import { Tip } from '../Tip'
import ProjectsDropdownButton from './ProjectsDropdownButton'
import UserContainer from './UserContainer'

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

export const FilledMenuBarIcon = styled(MenuBarIcon)`
  & path {
    fill: ${manuscriptsBlue};
  }

  &:hover path {
    fill: ${jellyBeanBlue};
  }
`

interface Props {
  handleClose: React.MouseEventHandler<HTMLElement>
  projectID: string
}

export const Menu: React.SFC<Props> = ({ handleClose, projectID }) => (
  <MenuContainer>
    <Tip title={'Back to Editor'} placement={'bottom-end'}>
      <FilledMenuBarIcon onClick={handleClose}>
        <NavIcon />
      </FilledMenuBarIcon>
    </Tip>

    <MenuSections>
      <MenuSection>
        <ProjectsDropdownButton />
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
