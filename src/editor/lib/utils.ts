import { Node as ProsemirrorNode } from 'prosemirror-model'
import { findParentNode } from 'prosemirror-utils'

export function* iterateChildren(
  node: ProsemirrorNode,
  recurse: boolean = false
): Iterable<ProsemirrorNode> {
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i)
    yield child

    if (recurse) {
      for (const grandchild of iterateChildren(child, true)) {
        yield grandchild
      }
    }
  }
}

export interface Selected {
  pos: number
  node: ProsemirrorNode
}

export const findParentNodeWithId = findParentNode(node => 'id' in node.attrs)
