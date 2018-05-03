import * as React from 'react'
import DraggableTree, {
  buildTree,
  DraggableTreeProps,
} from '../components/DraggableTree'

const ManuscriptOutlineContainer: React.SFC<DraggableTreeProps> = ({
  doc,
  onDrop,
}) => {
  if (!doc) return null

  const { pos, items } = buildTree(doc, 0, 0)

  const [manuscript, ...sections] = items

  const endPos = pos + manuscript.node.nodeSize

  const tree = { node: manuscript.node, pos, endPos, items: sections, index: 0 }

  return <DraggableTree tree={tree} onDrop={onDrop} />
}

export default ManuscriptOutlineContainer
