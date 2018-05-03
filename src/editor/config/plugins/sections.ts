import { Plugin } from 'prosemirror-state'
import schema from '../schema'

export default () => {
  return new Plugin({
    appendTransaction: (transactions, oldState, newState) => {
      let updated = 0

      let tr = newState.tr

      // if (!transactions.some(tr => tr.docChanged)) return null

      newState.doc.descendants((node, pos) => {
        if (node.type.name !== 'section') return false

        // add a paragraph to sections with only titles
        if (node.childCount === 1) {
          const title = node.child(0)
          const paragraph = schema.nodes.paragraph.create()
          tr = tr.insert(pos + 1 + title.nodeSize, paragraph)
          updated++
        }
      })

      // return the transaction if something changed
      if (updated) {
        return tr // .setMeta('addToHistory', false)
      }
    },
  })
}
