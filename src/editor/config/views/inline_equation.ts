import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView, NodeView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import { CodeMirrorCreator } from '../../lib/codemirror'
import { Mathjax } from '../../lib/mathjax'
import { NodeViewCreator } from '../types'

const xmlSerializer = new XMLSerializer()

class InlineEquation implements NodeView {
  public dom: HTMLElement

  private readonly props: EditorProps
  private readonly getPos: () => number
  private node: ProsemirrorNode
  private readonly view: EditorView

  private readonly imports: {
    codemirror: Promise<CodeMirrorCreator>
    mathjax: Promise<Mathjax>
  }

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

    this.imports = {
      codemirror: import(/* webpackChunkName: "codemirror" */ '../../lib/codemirror'),
      mathjax: import(/* webpackChunkName: "mathjax" */ '../../lib/mathjax') as Promise<
        Mathjax
      >,
    }

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

    const { createEditor } = await this.imports.codemirror
    const { typeset } = await this.imports.mathjax

    const input = await createEditor(
      this.node.attrs.TeXRepresentation || '',
      'stex'
    )

    input.on('changes', async () => {
      const TeXRepresentation = input.getValue()

      const typesetRoot = typeset(TeXRepresentation, true)

      if (!typesetRoot || !typesetRoot.firstChild) {
        throw new Error('No SVG output from MathJax')
      }

      const SVGRepresentation = xmlSerializer.serializeToString(
        typesetRoot.firstChild
      )

      const tr = this.view.state.tr
        .setNodeMarkup(this.getPos(), undefined, {
          ...this.node.attrs,
          TeXRepresentation,
          SVGRepresentation,
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
    return 'span'
  }

  protected async updateContents() {
    const { SVGRepresentation } = this.node.attrs

    if (SVGRepresentation) {
      this.dom.innerHTML = SVGRepresentation // TODO: sanitize!
    } else {
      while (this.dom.hasChildNodes()) {
        this.dom.removeChild(this.dom.firstChild!)
      }

      const placeholder = document.createElement('div')
      placeholder.className = 'equation-placeholder'
      placeholder.textContent = '<Equation>'

      this.dom.appendChild(placeholder)
    }
  }

  protected createDOM() {
    this.dom = document.createElement(this.elementType)
    this.dom.classList.add('equation')
  }
}

const inlineEquation = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new InlineEquation(props, node, view, getPos)

export default inlineEquation
