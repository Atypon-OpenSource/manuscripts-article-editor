import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView, NodeView } from 'prosemirror-view'
import { buildComment } from '../../../lib/commands'
import { EditorProps } from '../../Editor'
import { Menu } from '../../lib/menu'

abstract class AbstractBlock implements NodeView {
  protected get elementType() {
    return 'div'
  }

  public dom: HTMLElement
  public contentDOM: HTMLElement

  protected readonly props: EditorProps
  protected readonly getPos: () => number
  protected node: ProsemirrorNode
  protected readonly icons = {
    plus:
      '<svg width="16" height="16" stroke="currentColor"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>',
    circle:
      '<svg width="16" height="16" stroke="currentColor"><circle r="4" cx="8" cy="8"/></svg>',
  }
  protected readonly view: EditorView
  protected readonly menu: Menu

  protected constructor(
    props: EditorProps,
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
  ) {
    this.props = props
    this.node = node
    this.view = view
    this.getPos = getPos
  }

  public update(newNode: ProsemirrorNode): boolean {
    if (!newNode.sameMarkup(this.node)) return false
    this.node = newNode
    this.updateContents()
    return true
  }

  protected initialise() {
    this.createDOM()
    this.createElement()
    this.updateContents()
  }

  protected updateContents() {
    if (this.node.childCount) {
      this.contentDOM.classList.remove('empty-node')
    } else {
      this.contentDOM.classList.add('empty-node')

      const { placeholder } = this.node.attrs

      if (placeholder) {
        this.contentDOM.setAttribute('data-placeholder', placeholder)
      }
    }
  }

  protected createElement() {
    this.contentDOM = document.createElement(this.elementType)
    this.contentDOM.className = 'block'

    const { id, ...attrs } = this.node.attrs

    if (id) {
      this.contentDOM.id = id
    }

    Object.entries(attrs).forEach(([key, value]) => {
      this.contentDOM.setAttribute(key, value)
    })

    this.dom.appendChild(this.contentDOM)
  }

  private createDOM() {
    this.dom = document.createElement('div')
    this.dom.classList.add('block-container')
    this.dom.classList.add(`block-${this.node.type.name}`)

    const gutter = document.createElement('div')
    gutter.className = 'block-gutter'
    gutter.appendChild(this.createAddButton(false))
    gutter.appendChild(this.createEditButton())
    gutter.appendChild(this.createSpacer())
    gutter.appendChild(this.createAddButton(true))
    this.dom.appendChild(gutter)
  }

  private createAddButton = (after: boolean) => {
    const button = document.createElement('a')
    button.classList.add('add-block')
    button.classList.add(after ? 'add-block-after' : 'add-block-before')
    button.title = 'Add a new block'
    button.innerHTML = this.icons.plus
    button.addEventListener('mousedown', event => {
      event.preventDefault()
      event.stopPropagation()

      const menu = this.createMenu()
      menu.showAddMenu(event.currentTarget as HTMLAnchorElement, after)
    })

    return button
  }

  private createEditButton = () => {
    const button = document.createElement('a')
    button.classList.add('edit-block')
    button.title = 'Edit block'
    button.innerHTML = this.icons.circle
    button.addEventListener('mousedown', event => {
      event.preventDefault()
      event.stopPropagation()

      const menu = this.createMenu()
      menu.showEditMenu(event.currentTarget as HTMLAnchorElement)
    })

    return button
  }

  private createMenu = () =>
    new Menu(this.node, this.view, this.getPos, {
      createComment: this.createComment,
    })

  private createSpacer = () => {
    const spacer = document.createElement('div')
    spacer.classList.add('block-gutter-spacer')

    return spacer
  }

  private createComment = async (id: string) => {
    const user = this.props.getCurrentUser()

    const comment = buildComment(user.id, id)

    await this.props.saveComponent(comment)
  }
}

export default AbstractBlock
