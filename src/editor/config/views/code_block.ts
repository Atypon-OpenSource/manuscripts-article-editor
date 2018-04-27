import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorProps } from '../../Editor'
import { CodeMirrorCreator } from '../../lib/codemirror'
import { NodeViewCreator } from '../types'
import PropsBlock from './props_block'

// TODO: inline code editor

class CodeBlock extends PropsBlock {
  private element: HTMLElement
  private importCodeMirror: Promise<CodeMirrorCreator>

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
    const { createEditor } = await this.importCodeMirror

    const input = await createEditor(this.node.attrs.code, 'javascript')

    // input.className = 'code-editor'

    input.on('changes', () => {
      const tr = this.view.state.tr
        .setNodeMarkup(this.getPos(), undefined, {
          ...this.node.attrs,
          code: input.getValue(),
        })
        .setSelection(this.view.state.selection)

      this.view.dispatch(tr)
    })

    this.props.popper.show(this.dom, input.getWrapperElement(), 'bottom-start')

    input.refresh()
    window.requestAnimationFrame(() => input.focus())

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
    return 'pre'
  }

  protected get objectName() {
    return 'Listing'
  }

  protected prepare() {
    this.importCodeMirror = import(/* webpackChunkName: "codemirror" */ '../../lib/codemirror')
  }

  protected createElement() {
    this.element = document.createElement(this.elementType)
    this.element.className = 'block'
    this.element.dir = 'ltr'
    this.dom.appendChild(this.element)
  }

  protected async updateContents() {
    this.element.textContent = this.node.attrs.code

    if (!this.node.attrs.code) {
      const placeholder = document.createElement('div')
      placeholder.className = 'code-placeholder'
      placeholder.textContent = this.node.attrs.placeholder || '<Listing>'
      this.element.appendChild(placeholder)
    }
  }
}

const codeBlock = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new CodeBlock(props, node, view, getPos)

export default codeBlock
