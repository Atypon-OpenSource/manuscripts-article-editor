import { parse } from '@manuscripts/title-editor'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { Selected } from '../../editor/lib/utils'
import { Manuscript } from '../../types/models'
import { debounceRender } from '../DebounceRender'
import DraggableTree, { buildTree, TreeItem } from './DraggableTree'

interface Props {
  manuscript: Manuscript
  selected: Selected | null
  view: EditorView | null
  doc: ProsemirrorNode | null
}

const ManuscriptOutlineContainer: React.SFC<Props> = ({
  doc,
  manuscript,
  selected,
  view,
}) => {
  if (!doc || !view) return null

  const { items } = buildTree({ node: doc, pos: 0, index: 0, selected })

  const tree: TreeItem = {
    node: parse(manuscript.title || ''),
    pos: 0,
    endPos: 0,
    index: 0,
    isSelected: !selected,
    items,
  }

  return <DraggableTree tree={tree} view={view} />
}

export default ManuscriptOutlineContainer

export const DebouncedManuscriptOutlineContainer = debounceRender<Props>(
  ManuscriptOutlineContainer,
  500,
  {
    leading: true,
  }
)
