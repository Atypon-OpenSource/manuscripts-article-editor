import React from 'react'
import DraggableTree, {
  buildTree,
  DraggableTreeProps,
} from '../components/DraggableTree'
import { parse } from '../editor/manuscript/lib/title'
import { Manuscript } from '../types/components'

interface Props {
  manuscript: Manuscript
}

const ManuscriptOutlineContainer: React.SFC<Props & DraggableTreeProps> = ({
  doc,
  manuscript,
  onDrop,
}) => {
  if (!doc) return null

  const { items } = buildTree(doc, 0, 0)

  const tree = {
    node: parse(manuscript.title || ''),
    pos: 0,
    endPos: 0,
    index: 0,
    items,
  }

  return <DraggableTree tree={tree} onDrop={onDrop} />
}

export default ManuscriptOutlineContainer
