import { storiesOf } from '@storybook/react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import DraggableTree, {
  buildTree,
  TreeItem,
} from '../src/components/projects/DraggableTree'
import { parse } from '../src/editor/title/config'
import { doc } from './data/doc'
import { manuscript } from './data/manuscripts'

const node = document.createElement('div')
const state = EditorState.create({ doc })
const view = new EditorView(node, { state })

const selected = null

const { items } = buildTree({
  node: doc,
  pos: 0,
  index: 0,
  selected,
})

const tree: TreeItem = {
  node: parse(manuscript.title || ''),
  pos: 0,
  endPos: 0,
  index: 0,
  isSelected: !selected,
  items,
}

storiesOf('Projects/Tree', module).add('DraggableTree', () => (
  <DraggableTree tree={tree} view={view} />
))
