import React from 'react'
import DraggableTree, {
  buildTree,
  DraggableTreeProps,
  TreeItem,
} from '../components/DraggableTree'
import { Selected } from '../editor/lib/utils'
import { parse } from '../editor/manuscript/lib/title'
import { Manuscript } from '../types/components'

interface Props {
  manuscript: Manuscript
  selected?: Selected
}

const ManuscriptOutlineContainer: React.SFC<Props & DraggableTreeProps> = ({
  doc,
  manuscript,
  onDrop,
  selected,
}) => {
  if (!doc) return null

  const { items } = buildTree({ node: doc, pos: 0, index: 0, selected })

  const tree: TreeItem = {
    node: parse(manuscript.title || ''),
    pos: 0,
    endPos: 0,
    index: 0,
    isSelected: false,
    items,
  }

  return <DraggableTree tree={tree} onDrop={onDrop} />
}

export default ManuscriptOutlineContainer
