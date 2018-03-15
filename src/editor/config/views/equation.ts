import Popper from 'popper.js'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { generate } from '../../lib/mathjax'
import { createPopper, resizeTextarea } from '../../lib/popper'
import { NodeViewCreator } from '../types'

const equation = (display: boolean): NodeViewCreator => (
  node,
  view,
  getPos
) => {
  const element = display
    ? 'prosemirror-equation'
    : 'prosemirror-inline-equation'

  const dom = document.createElement(element)
  dom.setAttribute('id', node.attrs.id)
  dom.setAttribute('latex', node.attrs.latex)

  const updateContents = (math: string) => {
    generate(dom, math, display)
  }

  updateContents(node.attrs.latex)

  const input = document.createElement('textarea')
  input.setAttribute('rows', '1')
  input.className = 'equation-editor'
  input.addEventListener('input', () => {
    resizeTextarea(input)
    const tr = view.state.tr.setNodeMarkup(getPos(), undefined, {
      ...node.attrs,
      latex: input.value,
    })
    view.dispatch(tr)
  })

  let activePopper: Popper | null = null

  const popper = createPopper(input)
  popper.style.display = 'none'

  return {
    dom,
    selectNode() {
      input.value = node.attrs.latex
      resizeTextarea(input)
      popper.style.display = ''
      input.focus()
      activePopper = new Popper(dom, popper, {
        placement: 'bottom',
      })
    },
    deselectNode() {
      if (activePopper) {
        activePopper.destroy()
        activePopper = null
      }
      popper.style.display = 'none'
    },
    select() {
      return true
    },
    stopEvent() {
      return true
    },
    ignoreMutation() {
      return true
    },
    update(newNode: ProsemirrorNode): boolean {
      if (newNode.attrs.type !== node.attrs.type) return false

      updateContents(newNode.attrs.latex)

      node = newNode

      if (activePopper) {
        activePopper.update()
      }

      return true
    },
  }
}

export default equation
