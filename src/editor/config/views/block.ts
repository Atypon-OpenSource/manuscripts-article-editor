import { Node as ProsemirrorNode } from 'prosemirror-model'
// import { TextSelection } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import PopperManager from '../../lib/popper'

const popper = new PopperManager()

class Block implements NodeView {
  public dom: HTMLElement
  public contentDOM: HTMLElement

  protected readonly getPos: () => number
  protected node: ProsemirrorNode
  protected readonly icons = {
    plus:
      '<svg width="16" height="16" stroke="currentColor"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>',
    circle:
      '<svg width="16" height="16" stroke="currentColor"><circle r="4" cx="8" cy="8"/></svg>',
  }
  protected readonly view: EditorView
  // private readonly decorations?: Decoration[]

  constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
    // decorations?: Decoration[]
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos
    // this.decorations = decorations

    this.prepare()
    this.createDOM()
    this.createElement()
    this.updateContents()
  }

  public update(newNode: ProsemirrorNode): boolean {
    if (!newNode.sameMarkup(this.node)) return false
    this.node = newNode
    this.updateContents()
    return true
  }

  protected get elementType() {
    return 'div'
  }

  protected get objectName() {
    return 'Block'
  }

  protected prepare() {
    // no-op
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

  private addBlock = (
    nodeType: string,
    after: boolean,
    newPosition?: number
  ) => {
    if (newPosition === undefined) {
      newPosition = after ? this.getPos() + this.node.nodeSize : this.getPos()
    }

    const block = this.view.state.schema.nodes[
      nodeType
    ].createAndFill() as ProsemirrorNode

    // TODO: this is splitting the paragraph?
    const tr = this.view.state.tr.insert(newPosition, block)

    // TODO: select the thing after inserting it!
    // const selection = TextSelection.create(
    //   tr.doc,
    //   newPosition,
    //   newPosition + block.nodeSize
    // )
    // tr = tr.setSelection(selection).scrollIntoView()

    this.view.dispatch(tr)
  }

  private createAddButton = (after: boolean) => {
    const button = document.createElement('a')
    button.classList.add('add-block')
    button.classList.add(after ? 'add-block-after' : 'add-block-before')
    button.title = 'Add a new block'
    button.innerHTML = this.icons.plus
    button.addEventListener('click', this.showMenu(after))

    return button
  }

  private createEditButton = () => {
    const button = document.createElement('a')
    button.classList.add('edit-block')
    button.title = 'Edit block'
    button.innerHTML = this.icons.circle
    button.addEventListener('click', this.showEditMenu)

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
    item.addEventListener('click', handler)
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

  private showMenu = (after: boolean): EventListener => event => {
    const menu = document.createElement('div')
    menu.className = 'menu'

    menu.appendChild(
      this.createMenuSection((section: HTMLElement) => {
        const $pos = this.view.state.doc.resolve(this.getPos())
        const insertPos = after ? $pos.after(1) : $pos.before(1)
        const labelPrefix = after ? 'New Section After' : 'New Section Before'
        const sectionTitle = $pos.node(1).child(0).textContent
        const itemTitle = sectionTitle ? `“${sectionTitle}”` : 'This Section'
        const itemLabel = `${labelPrefix} ${itemTitle}`

        section.appendChild(
          this.createMenuItem(itemLabel, () => {
            this.addBlock('section', after, insertPos)
            popper.destroy()
          })
        )
      })
    )

    menu.appendChild(
      this.createMenuSection((section: HTMLElement) => {
        section.appendChild(
          this.createMenuItem('Paragraph', () => {
            this.addBlock('paragraph', after)
            popper.destroy()
          })
        )

        section.appendChild(
          this.createMenuItem('Numbered List', () => {
            this.addBlock('ordered_list', after)
            popper.destroy()
          })
        )

        section.appendChild(
          this.createMenuItem('Bullet list', () => {
            this.addBlock('bullet_list', after)
            popper.destroy()
          })
        )
      })
    )

    menu.appendChild(
      this.createMenuSection((section: HTMLElement) => {
        section.appendChild(
          this.createMenuItem('Figure Panel', () => {
            this.addBlock('figure', after)
            popper.destroy()
          })
        )

        section.appendChild(
          this.createMenuItem('Table', () => {
            this.addBlock('table_figure', after)
            popper.destroy()
          })
        )

        section.appendChild(
          this.createMenuItem('Equation', () => {
            this.addBlock('equation_block', after)
            popper.destroy()
          })
        )

        section.appendChild(
          this.createMenuItem('Listing', () => {
            this.addBlock('code_block', after)
            popper.destroy()
          })
        )
      })
    )

    popper.show(event.currentTarget as Element, menu, 'right-end')

    this.addPopperEventListeners(popper)
  }

  private handleDelete = (nodeType: string) => {
    switch (nodeType) {
      case 'section_title':
        return () => {
          const pos = this.getPos()
          const $pos = this.view.state.doc.resolve(pos)
          const parent = $pos.parent
          const parentPos = pos - $pos.parentOffset - 1
          this.view.dispatch(
            this.view.state.tr.delete(parentPos, parentPos + parent.nodeSize)
          )
          popper.destroy()
        }

      default:
        return () => {
          const pos = this.getPos()
          this.view.dispatch(
            this.view.state.tr.delete(pos, pos + this.node.nodeSize)
          )
          popper.destroy()
        }
    }
  }

  private showEditMenu: EventListener = event => {
    const menu = document.createElement('div')
    menu.className = 'menu'

    const nodeType = this.node.type.name

    menu.appendChild(
      this.createMenuSection((section: HTMLElement) => {
        section.appendChild(
          this.createMenuItem(
            `Delete ${this.objectName}`,
            this.handleDelete(nodeType)
          )
        )
      })
    )

    popper.show(event.currentTarget as Element, menu, 'right-end')

    this.addPopperEventListeners(popper)
  }

  private addPopperEventListeners = (popper: PopperManager) => {
    const mouseListener: EventListener = () => {
      window.requestAnimationFrame(() => {
        window.removeEventListener('mouseup', mouseListener)
        popper.destroy()
      })
    }

    const keyListener: EventListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        window.removeEventListener('keydown', keyListener)
        popper.destroy()
      }
    }

    window.addEventListener('mouseup', mouseListener)
    window.addEventListener('keydown', keyListener)
  }
}

export default Block
