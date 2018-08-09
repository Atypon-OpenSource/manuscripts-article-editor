import { Node as ProsemirrorNode } from 'prosemirror-model'

export function* iterateChildren(
  node: ProsemirrorNode
): Iterable<ProsemirrorNode> {
  for (let i = 0; i < node.childCount; i++) {
    yield node.child(i)
  }
}
