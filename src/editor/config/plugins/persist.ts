import { Plugin } from 'prosemirror-state'
import { generateID } from '../../../transformer/id'

export default () => {
  return new Plugin({
    appendTransaction: (transactions, oldState, newState) => {
      const updated: string[] = []

      // get the transaction from the new state
      let tr = newState.tr

      // for each node in the doc
      newState.doc.descendants((node, pos) => {
        const objectType = node.attrs['data-object-type']

        // if it's an object node without an id
        if (objectType && !node.attrs.id) {
          const id = generateID(objectType)

          // set the id on the node at this position
          tr = tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id,
          })

          // remember that something changed
          updated.push(id)
        }
      })

      // return the transaction if something changed
      if (updated.length) {
        return tr.setMeta('addToHistory', false)
      }
    },
  })
}
