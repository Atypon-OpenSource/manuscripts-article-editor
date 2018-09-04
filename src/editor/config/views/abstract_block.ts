import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView, NodeView } from 'prosemirror-view'
import { buildComment } from '../../../lib/commands'
import { EditorProps } from '../../Editor'
import PopperManager from '../../lib/popper'
import { createBlock } from '../commands'

const popper = new PopperManager()

abstract class AbstractBlock implements NodeView {
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

  protected get elementType() {
    return 'div'
  }

  protected get objectName() {
    return 'AbstractBlock'
  }

  protected updateContents() {
    if (this.node.childCount) {
      this.contentDOM.classList.remove('empty-node')
    } else {
      this.contentDOM.classList.add('empty-node')
      this.contentDOM.setAttribute(
        'data-placeholder',
        this.node.attrs.placeholder
      )
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
    this.dom.className = 'block-container'

    const gutter = document.createElement('div')
    gutter.className = 'block-gutter'
    gutter.appendChild(this.createAddButton(false))
    gutter.appendChild(this.createEditButton())
    gutter.appendChild(this.createSpacer())
    gutter.appendChild(this.createAddButton(true))
    this.dom.appendChild(gutter)
  }

  private addBlock = (type: string, after: boolean, position?: number) => {
    const { state, dispatch } = this.view

    if (position === undefined) {
      position = after ? this.getPos() + this.node.nodeSize : this.getPos()
    }

    const nodeType = state.schema.nodes[type]

    createBlock(nodeType, position, state, dispatch)
  }

  private canAddBlock = (type: string, after: boolean, position?: number) => {
    const { state } = this.view

    if (position === undefined) {
      position = after ? this.getPos() + this.node.nodeSize : this.getPos()
    }

    const $position = this.view.state.doc.resolve(position)

    const index = $position.index()

    const nodeType = state.schema.nodes[type]

    return $position.parent.canReplaceWith(index, index, nodeType)
  }

  private createAddButton = (after: boolean) => {
    const button = document.createElement('a')
    button.classList.add('add-block')
    button.classList.add(after ? 'add-block-after' : 'add-block-before')
    button.title = 'Add a new block'
    button.innerHTML = this.icons.plus
    button.addEventListener('mousedown', this.showMenu(after))

    return button
  }

  private createEditButton = () => {
    const button = document.createElement('a')
    button.classList.add('edit-block')
    button.title = 'Edit block'
    button.innerHTML = this.icons.circle
    button.addEventListener('mousedown', this.showEditMenu)

    return button
  }

  private createSpacer = () => {
    const spacer = document.createElement('div')
    spacer.classList.add('block-gutter-spacer')

    return spacer
  }

  private createMenuItem = (contents: string, handler: EventListener) => {
    const item = document.createElement('div')
    item.className = 'menu-item'
    item.textContent = contents
    item.addEventListener('mousedown', event => {
      event.preventDefault()
      handler(event)
    })
    return item
  }

  private createMenuSection = (
    createMenuItems: (section: HTMLElement) => void
  ) => {
    const section = document.createElement('div')
    section.className = 'menu-section'
    createMenuItems(section)
    return section
  }

  private sectionLevel = (depth: number) => {
    switch (depth) {
      case 1:
        return 'Section'
      default:
        return 'Sub' + 'sub'.repeat(depth - 2) + 'section'
    }
  }

  private insertableTypes = (
    after: boolean,
    insertPos: number,
    endPos: number
  ) => ({
    section: this.canAddBlock('section', after, insertPos),
    subsection: this.canAddBlock('section', after, endPos),
    paragraph: this.canAddBlock('paragraph', after),
    orderedList: this.canAddBlock('ordered_list', after),
    bulletList: this.canAddBlock('bullet_list', after),
    figure: this.canAddBlock('figure', after),
    tableFigure: this.canAddBlock('table_figure', after),
    equationBlock: this.canAddBlock('equation_block', after),
    codeBlock: this.canAddBlock('code_block', after),
  })

  private showMenuSection = (
    insertableTypes: { [key: string]: boolean },
    types: string[]
  ) => types.some(type => insertableTypes[type])

  private showMenu = (after: boolean): EventListener => event => {
    event.preventDefault()
    event.stopPropagation()

    const menu = document.createElement('div')
    menu.className = 'menu'

    const $pos = this.view.state.doc.resolve(this.getPos())
    const insertPos = after ? $pos.after($pos.depth) : $pos.before($pos.depth)
    const endPos = $pos.end()

    const insertableTypes = this.insertableTypes(after, insertPos, endPos)

    if (this.showMenuSection(insertableTypes, ['section', 'subsection'])) {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          const labelPosition = after ? 'After' : 'Before'
          const sectionTitle = $pos.node($pos.depth).child(0).textContent
          const itemTitle = sectionTitle ? `“${sectionTitle}”` : 'This Section'
          const sectionLevel = this.sectionLevel($pos.depth)
          const itemLabel = `New ${sectionLevel} ${labelPosition} ${itemTitle}`

          if (insertableTypes.section) {
            section.appendChild(
              this.createMenuItem(itemLabel, () => {
                this.addBlock('section', after, insertPos)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.subsection) {
            const subsectionLevel = this.sectionLevel($pos.depth + 1)
            const subItemLabel = `New ${subsectionLevel} to ${itemTitle}`

            section.appendChild(
              this.createMenuItem(subItemLabel, () => {
                this.addBlock('section', after, endPos)
                popper.destroy()
              })
            )
          }
        })
      )
    }

    if (
      this.showMenuSection(insertableTypes, [
        'paragraph',
        'orderedList',
        'bulletList',
      ])
    ) {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          if (insertableTypes.paragraph) {
            section.appendChild(
              this.createMenuItem('Paragraph', () => {
                this.addBlock('paragraph', after)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.orderedList) {
            section.appendChild(
              this.createMenuItem('Numbered List', () => {
                this.addBlock('ordered_list', after)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.bulletList) {
            section.appendChild(
              this.createMenuItem('Bullet list', () => {
                this.addBlock('bullet_list', after)
                popper.destroy()
              })
            )
          }
        })
      )
    }

    if (
      this.showMenuSection(insertableTypes, [
        'figure',
        'tableFigure',
        'equationBlock',
        'codeBlock',
      ])
    ) {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          if (insertableTypes.figure) {
            section.appendChild(
              this.createMenuItem('Figure Panel', () => {
                this.addBlock('figure', after)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.tableFigure) {
            section.appendChild(
              this.createMenuItem('Table', () => {
                this.addBlock('table_figure', after)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.equationBlock) {
            section.appendChild(
              this.createMenuItem('Equation', () => {
                this.addBlock('equation_block', after)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.codeBlock) {
            section.appendChild(
              this.createMenuItem('Listing', () => {
                this.addBlock('code_block', after)
                popper.destroy()
              })
            )
          }
        })
      )
    }

    popper.show(event.currentTarget as Element, menu, 'right-end')

    this.addPopperEventListeners(popper)
  }

  private changeNodeType = (type: string) => {
    const nodeType = this.view.state.schema.nodes[type]

    this.view.dispatch(
      this.view.state.tr.setNodeMarkup(this.getPos(), nodeType, {
        id: this.node.attrs.id,
      })
    )

    popper.destroy()
  }

  private deleteNode = (nodeType: string) => {
    switch (nodeType) {
      case 'section_title': {
        const pos = this.getPos()
        const $pos = this.view.state.doc.resolve(pos)
        const parent = $pos.parent
        const parentPos = pos - $pos.parentOffset - 1
        this.view.dispatch(
          this.view.state.tr.delete(parentPos, parentPos + parent.nodeSize)
        )
        break
      }

      default: {
        const pos = this.getPos()
        this.view.dispatch(
          this.view.state.tr.delete(pos, pos + this.node.nodeSize)
        )
        break
      }
    }
  }

  private createComment = async () => {
    const user = this.props.getCurrentUser()

    const comment = buildComment(user.id, this.node.attrs.id)

    await this.props.saveComponent(comment)
  }

  private isListType = (type: string) =>
    ['bullet_list', 'ordered_list'].includes(type)

  private showEditMenu: EventListener = event => {
    event.preventDefault()
    event.stopPropagation()

    const menu = document.createElement('div')
    menu.className = 'menu'

    const nodeType = this.node.type.name

    if (this.isListType(nodeType)) {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          if (nodeType === 'bullet_list') {
            section.appendChild(
              this.createMenuItem('Change to Numbered List', () => {
                this.changeNodeType('ordered_list')
                popper.destroy()
              })
            )
          }

          if (nodeType === 'ordered_list') {
            section.appendChild(
              this.createMenuItem('Change to Bullet List', () => {
                this.changeNodeType('bullet_list')
                popper.destroy()
              })
            )
          }
        })
      )
    }

    menu.appendChild(
      this.createMenuSection((section: HTMLElement) => {
        section.appendChild(
          this.createMenuItem('Comment', async () => {
            await this.createComment()
            popper.destroy()
          })
        )
      })
    )

    menu.appendChild(
      this.createMenuSection((section: HTMLElement) => {
        section.appendChild(
          this.createMenuItem(`Delete ${this.objectName}`, () => {
            this.deleteNode(nodeType)
            popper.destroy()
          })
        )
      })
    )

    popper.show(event.currentTarget as Element, menu, 'right-end')

    this.addPopperEventListeners(popper)
  }

  private addPopperEventListeners = (popper: PopperManager) => {
    const mouseListener: EventListener = () => {
      window.requestAnimationFrame(() => {
        window.removeEventListener('mousedown', mouseListener)
        popper.destroy()
      })
    }

    const keyListener: EventListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        window.removeEventListener('keydown', keyListener)
        popper.destroy()
      }
    }

    window.addEventListener('mousedown', mouseListener)
    window.addEventListener('keydown', keyListener)
  }
}

export default AbstractBlock
