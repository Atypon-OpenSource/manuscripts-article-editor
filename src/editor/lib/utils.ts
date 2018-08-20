import { Node as ProsemirrorNode } from 'prosemirror-model'
import { findParentNode } from 'prosemirror-utils'
import { NodeTypeName } from '../../transformer/node-types'

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

export const getMatchingChild = (
  parent: ProsemirrorNode,
  matcher: (node: ProsemirrorNode) => boolean
): ProsemirrorNode | undefined => {
  for (const node of iterateChildren(parent)) {
    if (matcher(node)) {
      return node
    }
  }
}

export const getChildOfType = (
  parent: ProsemirrorNode,
  nodeTypeName: NodeTypeName
): boolean =>
  !!getMatchingChild(parent, node => node.type.name === nodeTypeName)

export interface Selected {
  pos: number
  node: ProsemirrorNode
}

export const findParentNodeWithId = findParentNode(node => 'id' in node.attrs)
