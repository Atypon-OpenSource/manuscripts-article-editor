import * as React from 'react'
import { styled } from '../theme'
import {
  MenuBarButtonGenerator,
  MenuBarButtonProps,
  MenuBarProps,
} from './config/types'

export const MenuBarContainer = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: baseline;
`

export const MenuBarGroup = styled.div`
  margin-right: 10px;
  white-space: nowrap;

  & button:not(:first-of-type) {
    margin-left: -1px;
  }

  & button:first-of-type {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  & button:last-of-type {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`

export const StyledButton = styled.button`
  background-color: ${(props: MenuBarButtonProps) =>
    props['data-active'] ? '#eee' : '#fff'};
  border: 1px solid #ddd;
  cursor: pointer;
  padding: 6px 18px;
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

export const MenuBarButton: MenuBarButtonGenerator = (state, dispatch) => (
  key,
  item
) => (
  <StyledButton
    key={key}
    type="button"
    data-active={item.active && item.active(state)}
    title={item.title}
    disabled={item.enable && !item.enable(state)}
    onMouseDown={e => {
      e.preventDefault()
      item.run(state, dispatch)
    }}
  >
    {item.content}
  </StyledButton>
)

const MenuBar: React.SFC<MenuBarProps> = ({ menu, state, dispatch }) => {
  const createButton = MenuBarButton(state, dispatch)

  return (
    <MenuBarContainer>
      {Object.entries(menu).map(([key, buttons]) => (
        <MenuBarGroup key={key}>
          {Object.entries(buttons).map(([key, button]) =>
            createButton(key, button)
          )}
        </MenuBarGroup>
      ))}
    </MenuBarContainer>
  )
}

export default MenuBar
