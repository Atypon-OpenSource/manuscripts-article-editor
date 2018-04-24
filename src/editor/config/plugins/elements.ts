import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export default () => {
  return new Plugin({
    props: {
      decorations: state => {
        const decorations: Decoration[] = []

        // TODO: only calculate these when something changes

        state.doc.descendants((node, pos, parent) => {
          if (parent.type.name === 'section' && node.type.name !== 'section') {
            decorations.push(
              Decoration.node(
                pos,
                pos + node.nodeSize,
                {},
                {
                  element: true,
                }
              )
            )
          }
        })

        return DecorationSet.create(state.doc, decorations)
      },
    },
  })
}
