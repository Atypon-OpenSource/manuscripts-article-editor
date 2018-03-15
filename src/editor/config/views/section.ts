import { Node as ProsemirrorNode } from 'prosemirror-model'
import { TextSelection } from 'prosemirror-state'
import { NodeViewCreator } from '../types'

const svgIcon =
  '<svg width="16" height="16" stroke="currentColor"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>'

const section: NodeViewCreator = (node, view, getPos, decorations) => {
  const dom = document.createElement('div')

  if (!node.attrs.child) {
    dom.className = 'section-container'

    const addSection = (after: boolean) => () => {
      const pos = getPos()
      const sectionPos = after ? pos + node.nodeSize : pos
      const section = view.state.schema.nodes.section.createAndFill() as ProsemirrorNode
      const tr = view.state.tr.insert(sectionPos, section)
      const selection = TextSelection.create(tr.doc, sectionPos + 1)
      view.dispatch(tr.setSelection(selection).scrollIntoView())
    }

    const createButton = (after: boolean) => {
      const button = document.createElement('a')
      button.classList.add('add-section')
      button.classList.add(after ? 'add-section-after' : 'add-section-before')
      button.title = 'Add a new section'
      button.innerHTML = svgIcon
      button.addEventListener('click', addSection(after))

      return button
    }

    const gutter = document.createElement('div')
    gutter.className = 'section-gutter'
    gutter.appendChild(createButton(false))
    gutter.appendChild(createButton(true))
    dom.appendChild(gutter)
  }

  const contentDOM = document.createElement('section')
  contentDOM.setAttribute('id', node.attrs.id)
  dom.appendChild(contentDOM)

  const update = (newNode: ProsemirrorNode): boolean => {
    if (node.attrs.id !== newNode.attrs.id) return false
    node = newNode
    return true
  }

  return { dom, contentDOM, update }
}

export default section
