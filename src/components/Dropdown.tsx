import React from 'react'
import { NavLink } from 'react-router-dom'
import { deYorkGreen, jellyBeanBlue, manuscriptsBlue } from '../colors'
import DropdownToggle from '../icons/dropdown-toggle'
import { styled } from '../theme'
import { Badge } from './Badge'
import { InvitedBy } from './ProjectDropdown'

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`

export const Dropdown = styled.div`
  position: absolute;
  top: 32px;
  left: 5px;
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  color: #000;
  font-size: 14px;
  font-weight: normal;
  z-index: 10;
`

export const DropdownLink = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  padding: 13px 13px;
  align-items: center;
  text-decoration: none;
  color: inherit;
  white-space: nowrap;

  &:hover {
    background: ${manuscriptsBlue};
    color: white;
  }
`

export const DropdownElement = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 13px;
  text-decoration: none;
  color: inherit;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${manuscriptsBlue};
    color: white;
  }

  &:hover .user-icon-path {
    fill: white;
  }

  &:hover ${InvitedBy} {
    color: white;
  }
`

export const DropdownSeparator = styled.div`
  height: 1px;
  width: 100%;
  opacity: 0.23;
  background-color: #949494;
`

const DropdownButtonText = styled.div`
  display: flex;
  margin-right: 3px;
`

interface DropdownProps {
  isOpen: boolean
}

const StyledDropdownToggle = styled(DropdownToggle)`
  margin-left: 6px;
`

const NotificationsBadge = styled(Badge)<DropdownProps>`
  margin-left: 4px;
  color: ${props => (props.isOpen ? manuscriptsBlue : 'white')};
  background-color: ${props => (props.isOpen ? 'white' : deYorkGreen)};
  font-size: 9px;
  min-width: 10px;
  min-height: 10px;
  font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`

const DropdownButtonContainer = styled.button<DropdownProps>`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  text-decoration: none;
  border: none;
  font-size: inherit;
  border-radius: 4px;
  margin-left: 20px;
  cursor: pointer;
  background-color: ${props => (props.isOpen ? manuscriptsBlue : 'white')};
  color: ${props => (props.isOpen ? 'white' : 'inherit')};

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${jellyBeanBlue};
    color: white;
  }

  &:hover ${NotificationsBadge} {
    background-color: white;
    color: ${manuscriptsBlue};
  }
`

interface DropdownButtonProps {
  isOpen: boolean
  notificationsCount?: number
  onClick?: React.MouseEventHandler
}

export const DropdownButton: React.SFC<DropdownButtonProps> = ({
  children,
  isOpen,
  notificationsCount,
  onClick,
}) => (
  <DropdownButtonContainer
    onClick={onClick}
    isOpen={isOpen}
    className={'dropdown-toggle'}
  >
    <DropdownButtonText>{children}</DropdownButtonText>
    {!!notificationsCount && (
      <NotificationsBadge isOpen={isOpen}>
        {notificationsCount}
      </NotificationsBadge>
    )}
    <StyledDropdownToggle
      color={isOpen ? 'white' : 'currentColor'}
      transform={isOpen ? 'rotate(180)' : 'rotate(0)'}
    />
  </DropdownButtonContainer>
)
