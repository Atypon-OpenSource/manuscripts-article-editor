import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import DraggableTree, {
  buildTree,
  TreeItem,
} from '../src/components/DraggableTree'
import { parse } from '../src/editor/title/config'
import { createTestDoc } from '../src/transformer/__tests__/__helpers__/doc'
import { manuscript } from './data/manuscripts'

const doc = createTestDoc()
const selected = null

const { items } = buildTree({ node: doc, pos: 0, index: 0, selected })

const tree: TreeItem = {
  node: parse(manuscript.title || ''),
  pos: 0,
  endPos: 0,
  index: 0,
  isSelected: !selected,
  items,
}

storiesOf('Tree', module).add('DraggableTree', () => (
  <DraggableTree tree={tree} onDrop={action('drop')} />
))
