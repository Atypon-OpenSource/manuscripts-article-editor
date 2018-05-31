import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

export default () => {
  return new Plugin({
    appendTransaction: (transactions, oldState, newState) => {
      let updated = 0

      let tr = newState.tr

      if (!transactions.some(tr => tr.docChanged)) return null

      const joinAdjacentParagraphs = (parent: ProsemirrorNode, pos: number) => (
        node: ProsemirrorNode,
        offset: number,
        index: number
      ) => {
        const nodePos = pos + offset

        if (
          node.type.name === 'paragraph' &&
          !node.childCount &&
          index < parent.childCount - 1
        ) {
          const nextNode = parent.child(index + 1)

          if (nextNode.type.name === 'paragraph' && nextNode.childCount === 0) {
            tr = tr.join(nodePos + 2)
            updated++
          }
        }

        node.forEach(joinAdjacentParagraphs(node, nodePos + 1))
      }

      newState.doc.forEach(joinAdjacentParagraphs(newState.doc, 0))

      // return the transaction if something changed
      if (updated) {
        return tr // .setMeta('addToHistory', false)
      }
    },
  })
}
