import { EditorState } from 'prosemirror-state'
import React from 'react'
import Modal from 'react-modal'
import { Manager, Popper, Reference } from 'react-popper'
import { MenuItem } from '../editor/config/menus'
import { Dispatch } from '../editor/config/types'
import { styled } from '../theme'

// tslint:disable:max-classes-per-file

const Separator = styled.div`
  height: 0;
  border-bottom: 1px solid #ddd;
  margin: 4px 0;
`

const Icon = styled.div`
  display: none; // inline-flex; // TODO: width from config?
  flex-shrink: 0;
  margin: 0 8px;
`

const Active = styled.div`
  width: 16px;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
`

const Arrow = styled.div`
  margin-left: 8px;
  color: #444;
`

const Text = styled.div`
  flex: 1;
`

const ShortcutContainer = styled.div`
  display: inline-flex;
  color: #777;
  margin-left: 16px;
  flex-shrink: 0;
  justify-content: flex-end;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  padding: 8px 16px 8px 4px;

  &:hover {
    background: #65a3ff;
    color: white;
  }

  &:hover ${Arrow}, &:hover ${ShortcutContainer} {
    color: white;
  }

  &.disabled {
    opacity: 0.4;
  }
`

const ApplicationMenuContainer = styled.div`
  display: flex;
  font-size: 14px;
  padding: 0 30px;
`

const MenuHeading = styled.div`
  display: inline-flex;
  padding: 4px 8px;
  cursor: pointer;
  border: 1px solid transparent;
  border-bottom: none;
`

const MenuList = styled.div`
  width: auto;
  min-width: 150px;
  white-space: nowrap;
  box-shadow: 0 3px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #444;
  padding: 4px 0;
  background: white;
  z-index: 10;

  &[data-placement='bottom-start'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &[data-placement='right-start'] {
    top: 10px;
  }
`

const MenuContainer = styled.div`
  & ${MenuHeading}:hover {
    background: #eee;
  }

  &.active ${MenuHeading}:hover, &.active ${MenuHeading}.open {
    background: #65a3ff;
    color: white;
  }
`

const modalStyle = {
  content: {
    fontFamily: 'sans-serif',
  },
  overlay: {
    zIndex: 10,
  },
}

interface ShortcutProps {
  accelerator: string
}

const Shortcut: React.SFC<ShortcutProps> = ({ accelerator }) => (
  <ShortcutContainer>{accelerator}</ShortcutContainer>
)

interface MenuItemProps {
  item: MenuItem
  state: EditorState
  dispatch: Dispatch
  closeMenu: () => void
}

interface MenuItemState {
  isOpen: boolean
  isDropdownOpen: boolean
}

const classNameFromState = (item: MenuItem, state: EditorState) =>
  item.enable && !item.enable(state) ? 'disabled' : ''

const activeContent = (item: MenuItem, state: EditorState) =>
  item.active && item.active(state) ? '✓' : ''

export class MenuItemContainer extends React.Component<
  MenuItemProps,
  MenuItemState
> {
  public state = {
    isOpen: false,
    isDropdownOpen: false,
  }

  public render(): React.ReactNode | null {
    const { item, state, dispatch, closeMenu } = this.props
    const { isOpen } = this.state

    if (item.role === 'separator') return <Separator />

    if (!item.submenu) {
      const Dropdown = item.dropdown

      return (
        <Container
          className={classNameFromState(item, state)}
          onMouseDown={event => {
            event.preventDefault()

            if (item.dropdown) {
              this.toggleDropdown()
            } else if (item.run) {
              item.run(state, dispatch)
              closeMenu()
            } else {
              // console.warn('No dropdown or run')
            }
          }}
        >
          <Active>{activeContent(item, state)}</Active>
          {item.icon && <Icon>{item.icon}</Icon>}
          <Text>{item.label}</Text>
          {item.accelerator && <Shortcut accelerator={item.accelerator} />}

          {item.dropdown && (
            <Modal
              isOpen={this.state.isDropdownOpen}
              onRequestClose={this.toggleDropdown}
              style={modalStyle}
              ariaHideApp={false}
            >
              <Dropdown
                state={state}
                dispatch={dispatch}
                handleClose={this.toggleDropdown}
              />
            </Modal>
          )}
        </Container>
      )
    }

    return (
      <div onMouseLeave={() => this.setState({ isOpen: false })}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <Container
                innerRef={ref}
                onMouseEnter={() => this.setState({ isOpen: true })}
              >
                <Active>{activeContent(item, state)}</Active>
                {item.icon && <Icon>{item.icon}</Icon>}
                <Text>{item.label}</Text>
                {item.submenu && <Arrow>▶</Arrow>}
                {item.accelerator && (
                  <Shortcut accelerator={item.accelerator} />
                )}
              </Container>
            )}
          </Reference>
          {isOpen && (
            <Popper placement="right-start">
              {({ ref, style, placement }) => (
                <MenuList
                  innerRef={ref}
                  style={style}
                  data-placement={placement}
                >
                  {item.submenu &&
                    item.submenu.map((menu, index) => (
                      <MenuItemContainer
                        key={`menu-${index}`}
                        item={menu}
                        state={state}
                        dispatch={dispatch}
                        closeMenu={closeMenu}
                      />
                    ))}
                </MenuList>
              )}
            </Popper>
          )}
        </Manager>
      </div>
    )
  }

  private toggleDropdown = () => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    })
  }
}

interface MenuProps {
  menu: MenuItem
  state: EditorState
  dispatch: Dispatch
  isActive: boolean
}

interface MenuState {
  isOpen: boolean
}

export class Menu extends React.Component<MenuProps, MenuState> {
  public state = {
    isOpen: false,
  }

  public render() {
    const { menu, state, dispatch, isActive } = this.props
    const { isOpen } = this.state

    return (
      <MenuContainer
        className={isActive ? 'active' : ''}
        onMouseLeave={() => this.setState({ isOpen: false })}
      >
        <Manager>
          <Reference>
            {({ ref }) => (
              <MenuHeading
                innerRef={ref}
                onMouseEnter={() => this.setState({ isOpen: true })}
                className={isOpen ? 'open' : ''}
              >
                <Text>{menu.label}</Text>
              </MenuHeading>
            )}
          </Reference>
          {isOpen &&
            isActive && (
              <Popper placement="bottom-start">
                {({ ref, style, placement }) => (
                  <MenuList
                    innerRef={ref}
                    style={style}
                    data-placement={placement}
                  >
                    {menu.submenu &&
                      menu.submenu.map((menu, index) => (
                        <MenuItemContainer
                          key={`menu-${index}`}
                          item={menu}
                          state={state}
                          dispatch={dispatch}
                          closeMenu={this.closeMenu}
                        />
                      ))}
                  </MenuList>
                )}
              </Popper>
            )}
        </Manager>
      </MenuContainer>
    )
  }

  private closeMenu = () => {
    this.setState({
      isOpen: false,
    })
  }
}

interface Props {
  menus: MenuItem[]
  state: EditorState
  dispatch: Dispatch
}

interface State {
  isActive: boolean
}

export class ApplicationMenu extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isActive: false,
  }

  public render() {
    const { menus, state, dispatch } = this.props

    return (
      <ApplicationMenuContainer onMouseDown={this.toggleActive}>
        {menus.map((menu, index) => (
          <Menu
            key={`menu-${index}`}
            menu={menu}
            state={state}
            dispatch={dispatch}
            isActive={this.state.isActive}
          />
        ))}
      </ApplicationMenuContainer>
    )
  }

  private toggleActive = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    this.setState({
      isActive: !this.state.isActive,
    })
  }
}

// TODO: menu navigation by keyboard
