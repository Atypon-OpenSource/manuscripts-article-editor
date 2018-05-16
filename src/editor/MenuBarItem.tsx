import { EditorState } from 'prosemirror-state'
import React from 'react'
import Modal from 'react-modal'
import { styled } from '../theme'
import { Dispatch, MenuBarButtonProps, MenuButton } from './config/types'

export const MenuItem = styled.div`
  display: inline-flex;
  position: relative;
`

export const StyledButton = styled.button`
  background-color: ${(props: MenuBarButtonProps) =>
    props['data-active'] ? '#eee' : '#fff'};
  border: 1px solid #ddd;
  cursor: pointer;
  padding: 5px 15px;
  display: inline-flex;
  align-items: center;
  transition: 0.2s all;

  &:hover {
    background: #f6f6f6;
    z-index: 2;
  }

  &:active {
    background: #ddd;
  }

  &:disabled {
    opacity: 0.2;
  }
`

// const DropdownContainer = styled.div`
//   position: absolute;
//   top: 32px;
//   left: 0;
//   padding: 5px 0;
//   border: 1px solid #d6d6d6;
//   border-radius: 10px;
//   box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
//   background: #fff;
//   z-index: 10;
//   text-align: left;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `

const modalStyle = {
  content: {
    fontFamily: 'sans-serif',
  },
  overlay: {
    zIndex: 10,
  },
}

interface State {
  open: boolean
}

interface Props {
  key: string
  item: MenuButton
  state: EditorState
  dispatch: Dispatch
}

class MenuBarItem extends React.Component<Props, State> {
  public state = {
    open: false,
  }

  public render() {
    const { state, dispatch, item } = this.props

    const Dropdown = item.dropdown

    return (
      <MenuItem>
        <StyledButton
          type={'button'}
          title={item.title}
          data-active={item.active && item.active(state)}
          disabled={item.enable && !item.enable(state)}
          onMouseDown={event => {
            event.preventDefault()
            if (item.dropdown) {
              this.toggleDropdown()
            } else if (item.run) {
              item.run(state, dispatch)
            } else {
              // console.warn('No dropdown or run')
            }
          }}
        >
          {item.content}
        </StyledButton>

        {item.dropdown && (
          <Modal
            isOpen={this.state.open}
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

        {/*{this.state.open && (
          <DropdownContainer>
            <Dropdown state={state} dispatch={dispatch} />
          </DropdownContainer>
        )}*/}
      </MenuItem>
    )
  }

  private toggleDropdown = () => {
    this.setState({
      open: !this.state.open,
    })
  }
}

export default MenuBarItem
