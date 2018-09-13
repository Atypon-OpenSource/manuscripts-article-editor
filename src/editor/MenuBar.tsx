import React from 'react'
import { styled } from '../theme'
import { MenuBarProps } from './config/types'
import MenuBarItem, { MenuItem } from './MenuBarItem'

const MenuBarContainer = styled.div`
  margin: 6px;
  display: flex;
  align-items: baseline;
  //justify-content: center;
  flex-wrap: wrap;
`

export const MenuBarGroup = styled.div`
  margin-right: 8px;
  margin-bottom: 8px;
  white-space: nowrap;

  & ${MenuItem} button {
    margin-right: 0;
  }

  & ${MenuItem}:not(:first-of-type) button {
    margin-left: -1px;
  }

  & ${MenuItem}:first-of-type button {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  & ${MenuItem}:last-of-type button {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`

const MenuBar: React.SFC<MenuBarProps> = ({ menu, state, dispatch }) => (
  <MenuBarContainer>
    {Object.entries(menu).map(([key, items]) => (
      <MenuBarGroup key={key}>
        {Object.entries(items).map(([key, item]) => (
          <MenuBarItem
            key={key}
            state={state}
            dispatch={dispatch}
            item={item}
          />
        ))}
      </MenuBarGroup>
    ))}
  </MenuBarContainer>
)

export default MenuBar
