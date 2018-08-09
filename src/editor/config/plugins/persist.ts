import { Plugin } from 'prosemirror-state'
import { generateID } from '../../../transformer/id'
import { NodeTypeName } from '../../../transformer/node-types'

export default () => {
  return new Plugin({
    appendTransaction: (transactions, oldState, newState) => {
      let updated = 0

      // get the transaction from the new state
      let tr = newState.tr

      // only scan if nodes have changed
      if (!transactions.some(tr => tr.docChanged)) return null

      // TODO: keep track of changed nodes that haven't been saved yet?
      // TODO: call insertComponent directly?

      const ids = new Set()

      // for each node in the doc
      newState.doc.descendants((node, pos) => {
        const { id } = node.attrs

        if (typeof id !== 'string') {
          return true
        }

        if (id) {
          if (ids.has(id)) {
            // give the duplicate node a new id
            // TODO: maybe change the other node's ID?
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              id: generateID(node.type.name as NodeTypeName),
            })

            // remember that something changed
            updated++
          } else {
            ids.add(id)
          }
        } else {
          // set the id on the node at this position
          tr = tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id: generateID(node.type.name as NodeTypeName),
          })

          // remember that something changed
          updated++
        }
      })

      // return the transaction if something changed
      if (updated) {
        return tr.setMeta('addToHistory', false)
      }
    },
  })
}
