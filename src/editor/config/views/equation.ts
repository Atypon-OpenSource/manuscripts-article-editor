import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView, NodeView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import { CodeMirrorCreator } from '../../lib/codemirror'
import { Mathjax } from '../../lib/mathjax'
import { NodeViewCreator } from '../types'

class Equation implements NodeView {
  public dom: HTMLElement

  private readonly props: EditorProps
  private readonly getPos: () => number
  private node: ProsemirrorNode
  private readonly view: EditorView
  private importMathjax: Promise<Mathjax>
  private importCodeMirror: Promise<CodeMirrorCreator>

  constructor(
    props: EditorProps,
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
    // decorations?: Decoration[]
  ) {
    this.props = props
    this.node = node
    this.view = view
    this.getPos = getPos
    // this.decorations = decorations

    this.prepare()
    this.createDOM()
    this.updateContents().catch(error => {
      console.error(error) // tslint:disable-line:no-console
    })
  }

  public update(newNode: ProsemirrorNode): boolean {
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
    // dom.classList.add('ProseMirror-selectednode')

    const { createEditor } = await this.importCodeMirror

    const input = await createEditor(this.node.attrs.latex || '', 'stex')

    input.on('changes', () => {
      const tr = this.view.state.tr
        .setNodeMarkup(this.getPos(), undefined, {
          ...this.node.attrs,
          latex: input.getValue(),
        })
        .setSelection(this.view.state.selection)

      this.view.dispatch(tr)
    })

    this.props.popper.show(this.dom, input.getWrapperElement(), 'bottom')

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
    return event.type !== 'mousedown' && !event.type.startsWith('drag')
  }

  public ignoreMutation() {
    return true
  }

  protected get elementType() {
    return 'prosemirror-inline-equation'
  }

  protected prepare() {
    this.importMathjax = import(/* webpackChunkName: "mathjax" */ '../../lib/mathjax')
    this.importCodeMirror = import(/* webpackChunkName: "codemirror" */ '../../lib/codemirror')
  }

  protected async updateContents() {
    try {
      const mathjax = await this.importMathjax
      mathjax.generate(this.dom, this.node.attrs.latex, false)
    } catch (e) {
      // TODO: improve the UI for presenting offline/import errors
      window.alert(
        'There was an error loading MathJax, please reload to try again'
      )
    }
  }

  protected createDOM() {
    this.dom = document.createElement(this.elementType)
  }
}

const equation = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new Equation(props, node, view, getPos)

export default equation
