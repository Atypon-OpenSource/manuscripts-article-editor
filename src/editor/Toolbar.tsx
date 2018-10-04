import React from 'react'
import { styled } from '../theme'
import { ToolbarProps } from './config/types'
import ToolbarItemContainer, { ToolbarItem } from './ToolbarItemContainer'

const ToolbarContainer = styled.div`
  margin: 6px;
  display: flex;
  align-items: baseline;
  //justify-content: center;
  flex-wrap: wrap;
`

export const ToolbarGroup = styled.div`
  margin-right: 8px;
  margin-bottom: 8px;
  white-space: nowrap;

  & ${ToolbarItem} button {
    margin-right: 0;
  }

  & ${ToolbarItem}:not(:first-of-type) button {
    margin-left: -1px;
  }

  & ${ToolbarItem}:first-of-type button {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  & ${ToolbarItem}:last-of-type button {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`

const Toolbar: React.SFC<ToolbarProps> = ({ toolbar, state, dispatch }) => (
  <ToolbarContainer>
    {Object.entries(toolbar).map(([key, items]) => (
      <ToolbarGroup key={key} className={'toolbar-group'}>
        {Object.entries(items).map(([key, item]) => (
          <ToolbarItemContainer
            key={key}
            state={state}
            dispatch={dispatch}
            item={item}
          />
        ))}
      </ToolbarGroup>
    ))}
  </ToolbarContainer>
)

export default Toolbar
