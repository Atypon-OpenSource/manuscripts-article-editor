import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import { CodeMirrorCreator } from '../../lib/codemirror'
import { Mathjax } from '../../lib/mathjax'
import { NodeViewCreator } from '../types'
import AbstractBlock from './abstract_block'

class EquationBlock extends AbstractBlock {
  private element: HTMLElement
  private readonly imports: {
    codemirror: Promise<CodeMirrorCreator>
    mathjax: Promise<Mathjax>
  }

  public constructor(
    props: EditorProps,
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
  ) {
    super(props, node, view, getPos)

    this.imports = {
      codemirror: import(/* webpackChunkName: "codemirror" */ '../../lib/codemirror'),
      mathjax: import(/* webpackChunkName: "mathjax" */ '../../lib/mathjax') as Promise<
        Mathjax
      >,
    }

    this.initialise()
  }

  public update(newNode: ProsemirrorNode) {
    if (newNode.attrs.id !== this.node.attrs.id) return false
    if (newNode.type.name !== this.node.type.name) return false
    this.node = newNode
    this.updateContents().catch(error => {
      console.error(error) // tslint:disable-line:no-console
    })
    this.props.popper.update()
    return true
  }

  public async selectNode() {
    const { createEditor } = await this.imports.codemirror

    const input = await createEditor(this.node.attrs.latex, 'stex')

    input.on('changes', () => {
      const tr = this.view.state.tr
        .setNodeMarkup(this.getPos(), undefined, {
          ...this.node.attrs,
          latex: input.getValue(),
        })
        .setSelection(this.view.state.selection)

      this.view.dispatch(tr)
    })

    this.props.popper.show(this.element, input.getWrapperElement(), 'bottom')

    window.requestAnimationFrame(() => {
      input.refresh()
      input.focus()
    })

    // dom.classList.add('ProseMirror-selectednode')
  }

  public deselectNode() {
    this.props.popper.destroy()
    // dom.classList.remove('ProseMirror-selectednode')
  }

  public stopEvent(event: Event) {
    return !event.type.startsWith('drag')
  }

  public ignoreMutation() {
    return true
  }

  protected get elementType() {
    return 'prosemirror-equation'
  }

  protected get objectName() {
    return 'Equation'
  }

  protected async updateContents() {
    try {
      const mathjax = await this.imports.mathjax
      mathjax.generate(this.element, this.node.attrs.latex, true)
    } catch (e) {
      // TODO: improve the UI for presenting offline/import errors
      window.alert(
        'There was an error loading MathJax, please reload to try again'
      )
    }
  }

  protected createElement() {
    this.element = document.createElement(this.elementType)
    this.element.className = 'block'
    this.element.id = this.node.attrs.id
    this.dom.appendChild(this.element)
  }
}

const equationBlock = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new EquationBlock(props, node, view, getPos)

export default equationBlock
