import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import Modal from 'react-modal'
import { Manager, Popper, Reference } from 'react-popper'
import { manuscriptsBlue } from '../colors'
import { MenuItem } from '../editor/config/menus'
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
    background: ${manuscriptsBlue};
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
    background: ${manuscriptsBlue};
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
  view: EditorView
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
  private menuTimeout: number

  public render(): React.ReactNode | null {
    const { item, state, view, closeMenu } = this.props
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
              this.openDropdown()
            } else if (item.run) {
              item.run(state, view.dispatch)
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
              onRequestClose={this.closeDropdown}
              shouldCloseOnOverlayClick={false}
              style={modalStyle}
              ariaHideApp={false}
            >
              <Dropdown
                state={state}
                view={view}
                handleClose={this.closeDropdown}
              />
            </Modal>
          )}
        </Container>
      )
    }

    return (
      <div onMouseLeave={this.closeMenu}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <Container
                // @ts-ignore: styled
                ref={ref}
                onMouseEnter={this.openMenu}
                className={classNameFromState(item, state)}
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
                  // @ts-ignore: styled
                  ref={ref}
                  style={style}
                  data-placement={placement}
                >
                  {item.submenu &&
                    item.submenu.map((menu, index) => (
                      <MenuItemContainer
                        key={`menu-${index}`}
                        item={menu}
                        state={state}
                        view={view}
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

  private openMenu = () => {
    window.clearTimeout(this.menuTimeout)

    this.menuTimeout = window.setTimeout(() => {
      this.setState({
        isOpen: true,
      })
    }, 100)
  }

  private closeMenu = () => {
    window.clearTimeout(this.menuTimeout)

    this.menuTimeout = window.setTimeout(() => {
      this.setState({
        isOpen: false,
      })
    }, 100)
  }

  private openDropdown = () => {
    this.setState({
      isDropdownOpen: true,
    })
  }

  private closeDropdown = () => {
    this.setState(
      {
        isDropdownOpen: false,
      },
      () => {
        this.props.closeMenu()
      }
    )
  }
}

interface Props {
  menus: MenuItem[]
  state: EditorState
  view: EditorView
}

interface State {
  activeMenu: number | null
}

export class ApplicationMenu extends React.Component<Props, State> {
  public state: Readonly<State> = {
    activeMenu: null,
  }
  private containerRef: React.RefObject<HTMLDivElement>

  public constructor(props: Props) {
    super(props)
    this.containerRef = React.createRef()
  }

  public componentDidMount() {
    this.addClickListener()
  }

  public componentWillUnmount() {
    this.removeClickListener()
  }

  public render() {
    const { menus, state, view } = this.props
    const { activeMenu } = this.state

    return (
      // @ts-ignore: styled
      <ApplicationMenuContainer ref={this.containerRef}>
        {menus.map((menu, index) => (
          <MenuContainer
            key={`menu-${index}`}
            className={activeMenu === index ? 'active' : ''}
          >
            <Manager>
              <Reference>
                {({ ref }) => (
                  <MenuHeading
                    // @ts-ignore: styled
                    ref={ref}
                    onMouseDown={event => {
                      event.preventDefault()
                      this.setActiveMenu(activeMenu !== null ? null : index)
                    }}
                    onMouseEnter={() => {
                      if (activeMenu !== null) {
                        this.setActiveMenu(index)
                      }
                    }}
                    className={activeMenu === index ? 'open' : ''}
                  >
                    <Text>{menu.label}</Text>
                  </MenuHeading>
                )}
              </Reference>

              {activeMenu === index && (
                <Popper placement="bottom-start">
                  {({ ref, style, placement }) => (
                    <MenuList
                      // @ts-ignore: styled
                      ref={ref}
                      style={style}
                      data-placement={placement}
                    >
                      {menu.submenu &&
                        menu.submenu.map((menu, index) => (
                          <MenuItemContainer
                            key={`menu-${index}`}
                            item={menu}
                            state={state}
                            view={view}
                            closeMenu={() => {
                              this.setActiveMenu(null)
                            }}
                          />
                        ))}
                    </MenuList>
                  )}
                </Popper>
              )}
            </Manager>
          </MenuContainer>
        ))}
      </ApplicationMenuContainer>
    )
  }

  private setActiveMenu = (index: number | null) => {
    this.setState({
      activeMenu: index,
    })
  }

  private addClickListener = () => {
    document.addEventListener('mousedown', this.handleClick)
  }

  private removeClickListener = () => {
    document.removeEventListener('mousedown', this.handleClick)
  }

  private handleClick = (event: MouseEvent) => {
    if (
      this.containerRef.current &&
      !this.containerRef.current.contains(event.target as Node)
    ) {
      this.setActiveMenu(null)
      this.removeClickListener()
    }
  }
}

// TODO: menu navigation by keyboard
