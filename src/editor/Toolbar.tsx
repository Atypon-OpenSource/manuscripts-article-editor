import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { styled } from '../theme'
import { Dispatch } from './config/types'
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

interface ToolbarProps {
  toolbar: ToolbarButtonMapMap
  state: EditorState
  view: EditorView
}

interface ToolbarButtonMapMap {
  [key: string]: ToolbarButtonMap
}

export interface ToolbarButtonMap {
  [key: string]: ToolbarButton
}

export interface ToolbarDropdownProps {
  state: EditorState
  view: EditorView
  handleClose: () => void
}

export interface ToolbarButton {
  title: string
  content: React.ReactNode
  active?: (state: EditorState) => boolean
  run?: (state: EditorState, dispatch: Dispatch) => void
  enable?: (state: EditorState) => boolean
  dropdown?: any // tslint:disable-line:no-any // TODO
}

const Toolbar: React.SFC<ToolbarProps> = ({ toolbar, state, view }) => (
  <ToolbarContainer>
    {Object.entries(toolbar).map(([key, items]) => (
      <ToolbarGroup key={key} className={'toolbar-group'}>
        {Object.entries(items).map(([key, item]) => (
          <ToolbarItemContainer
            key={key}
            state={state}
            view={view}
            item={item}
          />
        ))}
      </ToolbarGroup>
    ))}
  </ToolbarContainer>
)

export default Toolbar
