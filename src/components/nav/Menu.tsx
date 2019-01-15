import NavIcon from '@manuscripts/assets/react/NavIcon'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled, ThemedProps } from '../../theme'
import { Tip } from '../Tip'
import ProjectsDropdownButton from './ProjectsDropdownButton'
import UserContainer from './UserContainer'

type ThemedDivProps = ThemedProps<HTMLDivElement>
type ThemedNavLinkProps = ThemedProps<NavLink>
type ThemedButtonProps = ThemedProps<HTMLButtonElement>

export const MenuContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  align-items: center;
  color: ${(props: ThemedDivProps) => props.theme.colors.menu.text};
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
  padding: 3px 8px;
  text-decoration: none;
  color: inherit;
  border: solid 2px
    ${(props: ThemedNavLinkProps) => props.theme.colors.menu.button};
  border-radius: 4px;
  margin-left: 20px;

  &.active {
    background: ${(props: ThemedNavLinkProps) =>
      props.theme.colors.menu.button};
    color: white;
  }

  &:hover {
    background: white;
    color: ${(props: ThemedNavLinkProps) => props.theme.colors.menu.button};
    border: solid 2px
      ${(props: ThemedNavLinkProps) => props.theme.colors.menu.button};
  }
`

export const FilledMenuBarIcon = styled(MenuBarIcon)`
  & path {
    fill: ${(props: ThemedButtonProps) => props.theme.colors.menu.icon.default};
  }

  &:hover path {
    fill: ${(props: ThemedButtonProps) =>
      props.theme.colors.menu.icon.selected};
  }
`

interface Props {
  handleClose: React.MouseEventHandler<HTMLElement>
  projectID: string
}

export const Menu: React.FunctionComponent<Props> = ({
  handleClose,
  projectID,
}) => (
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
