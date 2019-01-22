import ArrowDownUp from '@manuscripts/assets/react/ArrowDownUp'
import React from 'react'
import { Manager, Popper, Reference } from 'react-popper'
import { NavLink } from 'react-router-dom'
import { lightGrey } from '../../colors'
import { styled, ThemedProps } from '../../theme'
import { Badge } from '../Badge'
import { InvitedBy, PlaceholderTitle } from './ProjectDropdown'

type ThemedButtonProps = ThemedProps<HTMLButtonElement>
type ThemedAnchorProps = ThemedProps<HTMLAnchorElement>
type ThemedDivProps = ThemedProps<HTMLDivElement>

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`

export const Dropdown = styled.div`
  position: absolute;
  top: 32px;
  left: 5px;
  border: 1px solid ${lightGrey};
  border-radius: 4px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  background: ${(props: ThemedDivProps) =>
    props.theme.colors.dropdown.background.default};
  color: #000;
  font-size: 14px;
  font-weight: normal;
  z-index: 10;
`

export const DropdownLink = styled(NavLink)<{ disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 13px 13px;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
  color: ${props =>
    props.disabled
      ? props.theme.colors.dropdown.text.secondary
      : props.theme.colors.dropdown.text.primary};
  pointer-events: ${props => (props.disabled ? 'none' : 'unset')};

  &:hover,
  &:hover ${PlaceholderTitle} {
    background: ${(props: ThemedAnchorProps) =>
      props.theme.colors.dropdown.background.hovered};
    color: ${(props: ThemedAnchorProps) =>
      props.theme.colors.dropdown.text.hovered};
  }
`

export const DropdownElement = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 13px;
  text-decoration: none;
  color: ${props =>
    props.disabled
      ? props.theme.colors.dropdown.text.secondary
      : props.theme.colors.dropdown.text.primary};
  white-space: nowrap;
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? 'none' : 'unset')};

  &:hover {
    background: ${(props: ThemedDivProps) =>
      props.theme.colors.dropdown.background.hovered};
    color: ${(props: ThemedDivProps) =>
      props.theme.colors.dropdown.text.hovered};
  }

  &:hover .user-icon-path {
    fill: white;
  }

  &:hover ${InvitedBy} {
    color: ${(props: ThemedDivProps) =>
      props.theme.colors.dropdown.text.hovered};
  }
`

export const DropdownSeparator = styled.div`
  height: 1px;
  width: 100%;
  opacity: 0.23;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.dropdown.separator};
`

const DropdownButtonText = styled.div`
  display: flex;
  margin-right: 3px;
`

interface DropdownProps {
  isOpen: boolean
}

const DropdownToggle = styled(ArrowDownUp)`
  margin-left: 6px;
  transform: rotate(180deg);

  & path {
    stroke: currentColor;
  }

  &.open {
    transform: rotate(0deg);

    & path {
      stroke: white;
    }
  }
`

const NotificationsBadge = styled(Badge)<DropdownProps>`
  margin-left: 4px;
  color: ${props =>
    props.isOpen ? props.theme.colors.dropdown.notification.default : 'white'};
  background-color: ${props =>
    props.isOpen ? 'white' : props.theme.colors.dropdown.notification.default};
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
  background-color: ${props =>
    props.isOpen ? props.theme.colors.button.primary : 'white'};
  color: ${props => (props.isOpen ? 'white' : 'inherit')};

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
    color: white;
  }

  &:hover ${NotificationsBadge} {
    background-color: white;
    color: ${(props: ThemedButtonProps) => props.theme.colors.button.primary};
  }
`

interface DropdownButtonProps {
  isOpen: boolean
  notificationsCount?: number
  onClick?: React.MouseEventHandler
}

export const DropdownButton: React.FunctionComponent<DropdownButtonProps> = ({
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
    <DropdownToggle className={isOpen ? 'open' : ''} />
  </DropdownButtonContainer>
)

interface State {
  showSubmenu: boolean
}

interface Props {
  label: string
}

const ContextMenuDropdown = styled(Dropdown)`
  width: 160px;
`
export class DropdownElementWithSubmenu extends React.Component<Props, State> {
  public state: Readonly<State> = {
    showSubmenu: false,
  }

  public render() {
    const { showSubmenu } = this.state

    return (
      <Manager>
        <div
          onMouseLeave={() => this.setState({ showSubmenu: false })}
          onMouseEnter={() => this.setState({ showSubmenu: true })}
        >
          <Reference>
            {({ ref }) => (
              <DropdownElement
                // @ts-ignore: styled
                ref={ref}
              >
                {this.props.label}
              </DropdownElement>
            )}
          </Reference>
          {showSubmenu && (
            <Popper placement="right-start">
              {({ ref, style, placement }) => (
                <ContextMenuDropdown
                  // @ts-ignore: styled
                  ref={ref}
                  style={style}
                  data-placement={placement}
                >
                  {this.props.children}
                </ContextMenuDropdown>
              )}
            </Popper>
          )}
        </div>
      </Manager>
    )
  }
}
