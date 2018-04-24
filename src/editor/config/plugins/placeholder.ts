import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export default () => {
  return new Plugin({
    props: {
      decorations: state => {
        const decorations: Decoration[] = []

        const decorate = (node: ProsemirrorNode, pos: number) => {
          if (node.type.isBlock && node.childCount === 0) {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: 'empty-node',
              })
            )
          }
        }

        state.doc.descendants(decorate)

        return DecorationSet.create(state.doc, decorations)
      },
    },
    appendTransaction: (transactions, oldState, newState) => {
      let updated = 0

      let tr = newState.tr

      if (!transactions.some(tr => tr.docChanged)) return null

      // join adjacent empty paragraphs
      newState.doc.descendants((node, pos) => {
        if (node.type.name === 'paragraph' && node.childCount === 0) {
          const nextPos = pos + node.nodeSize
          const nextNode = newState.doc.nodeAt(nextPos)

          if (
            nextNode &&
            nextNode.type.name === 'paragraph' &&
            nextNode.childCount === 0
          ) {
            tr = tr.join(nextPos)
            updated++
          }
        }
      })

      // return the transaction if something changed
      if (updated) {
        return tr.setMeta('addToHistory', false)
      }
    },
  })
}
