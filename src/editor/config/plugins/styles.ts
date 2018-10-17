import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { BorderStyle, FigureStyle } from '../../../types/models'
import { EditorProps } from '../../Editor'

export default (props: EditorProps) => {
  const { getModel } = props

  const findBorderStyle = (item: FigureStyle) => {
    const defaultStyle: Partial<BorderStyle> = {
      doubleLines: false,
    }

    if (!item.innerBorder.style) return defaultStyle

    const style = getModel<BorderStyle>(item.innerBorder.style)

    return style || defaultStyle
  }

  // TODO: handle missing components?
  // TODO: subscribe to the db directly and use styled-components?
  // TODO: use context to subscribe a "subscribeToComponent" method?
  const styleString = (id: string) => {
    const item = getModel<FigureStyle>(id)

    // TODO: handle missing objects?
    // https://gitlab.com/mpapp-private/manuscripts-frontend/issues/395
    if (!item) return ''

    // TODO: bundled objects need to be available here
    const borderStyle = findBorderStyle(item)

    const styles = [
      ['border-color', item.innerBorder.color], // TODO: need bundled colors - this is an id
      ['border-width', item.innerBorder.width + 'px'],
      ['border-style', borderStyle.doubleLines ? 'double' : 'solid'],
    ]

    return styles.map(style => style.join(':')).join(';')
  }

  return new Plugin({
    props: {
      decorations: state => {
        const decorations: Decoration[] = []

        // TODO: generate decorations when state changes and just map them here?

        state.doc.descendants((node, pos) => {
          if (node.attrs.figureStyle) {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                style: styleString(node.attrs.figureStyle),
              })
            )
          }
        })

        return DecorationSet.create(state.doc, decorations)
      },
    },
  })
}
