import { Fragment, Node as ProsemirrorNode, Slice } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { nodeNames } from '../../transformer/node-names'
import { createBlock } from '../config/commands'
import { Nodes } from '../config/schema/nodes'
import PopperManager from './popper'

const popper = new PopperManager()

export const sectionLevel = (depth: number) => {
  switch (depth) {
    case 1:
      return 'Section'
    default:
      return 'Sub' + 'sub'.repeat(depth - 2) + 'section'
  }
}

interface Actions {
  createComment?: (id: string) => Promise<void>
}

interface SuppressOption {
  attr: string
  attrs: { [key: string]: boolean }
  getPos: () => number
  label: string
}

export class Menu {
  private readonly node: ProsemirrorNode
  private readonly view: EditorView
  private readonly getPos: () => number
  private readonly actions: Actions

  private suppressibleAttrs: Map<string, string> = new Map([
    ['suppressCaption', 'Caption'],
    ['suppressHeader', 'Header'],
    ['suppressFooter', 'Footer'],
    // ['titleSuppressed', 'Heading'],
  ])

  public constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number,
    actions: Actions = {}
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos
    this.actions = actions
  }

  public showAddMenu = (target: Element, after: boolean) => {
    const menu = document.createElement('div')
    menu.className = 'menu'

    const $pos = this.resolvePos()
    const insertPos = after ? $pos.after($pos.depth) : $pos.before($pos.depth)
    const endPos = $pos.end()

    const insertableTypes = this.insertableTypes(after, insertPos, endPos)

    if (this.showMenuSection(insertableTypes, ['section', 'subsection'])) {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          const labelPosition = after ? 'After' : 'Before'
          const sectionTitle = $pos.node($pos.depth).child(0).textContent
          const itemTitle = sectionTitle ? `“${sectionTitle}”` : 'This Section'
          const itemLabel = `New ${sectionLevel(
            $pos.depth
          )} ${labelPosition} ${itemTitle}`

          if (insertableTypes.section) {
            section.appendChild(
              this.createMenuItem(itemLabel, () => {
                this.addBlock('section', after, insertPos)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.subsection) {
            const subItemLabel = `New ${sectionLevel(
              $pos.depth + 1
            )} to ${itemTitle}`

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
        'tableElement',
        'equationElement',
        'listingElement',
      ])
    ) {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          if (insertableTypes.figureElement) {
            section.appendChild(
              this.createMenuItem('Figure Panel', () => {
                this.addBlock('figure_element', after)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.tableElement) {
            section.appendChild(
              this.createMenuItem('Table', () => {
                this.addBlock('table_element', after)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.equationElement) {
            section.appendChild(
              this.createMenuItem('Equation', () => {
                this.addBlock('equation_element', after)
                popper.destroy()
              })
            )
          }

          if (insertableTypes.listingElement) {
            section.appendChild(
              this.createMenuItem('Listing', () => {
                this.addBlock('listing_element', after)
                popper.destroy()
              })
            )
          }
        })
      )
    }

    popper.show(target, menu, 'right-end')

    this.addPopperEventListeners(popper)
  }

  public showEditMenu = (target: Element) => {
    const menu = document.createElement('div')
    menu.className = 'menu'

    const $pos = this.resolvePos()
    const nodeType = this.node.type.name as Nodes

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

    if (this.actions.createComment) {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          section.appendChild(
            this.createMenuItem('Comment', async () => {
              await this.actions.createComment!(this.node.attrs.id)
              popper.destroy()
            })
          )
        })
      )
    }

    const suppressOptions = this.buildSuppressOptions()

    if (suppressOptions.length) {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          for (const option of suppressOptions) {
            // TODO: parent node attrs
            const label = option.attrs[option.attr]
              ? `Show ${option.label}`
              : `Hide ${option.label}`

            section.appendChild(
              this.createMenuItem(label, async () => {
                this.toggleNodeAttr(option)
                popper.destroy()
              })
            )
          }
        })
      )
    }

    if (nodeType === 'paragraph' && $pos.parent.type.name === 'section') {
      menu.appendChild(
        this.createMenuSection((section: HTMLElement) => {
          section.appendChild(
            this.createMenuItem(
              `Split to New ${sectionLevel($pos.depth)}`,
              () => {
                this.splitSection()
                popper.destroy()
              }
            )
          )
        })
      )
    }

    menu.appendChild(
      this.createMenuSection((section: HTMLElement) => {
        const nodeName = nodeNames.get(nodeType) || ''

        section.appendChild(
          this.createMenuItem(`Delete ${nodeName}`, () => {
            this.deleteNode(nodeType)
            popper.destroy()
          })
        )
      })
    )

    popper.show(target, menu, 'right-end')

    this.addPopperEventListeners(popper)
  }

  private addBlock = (type: Nodes, after: boolean, position?: number) => {
    const { state, dispatch } = this.view

    if (position === undefined) {
      position = after ? this.getPos() + this.node.nodeSize : this.getPos()
    }

    const nodeType = state.schema.nodes[type]

    createBlock(nodeType, position, state, dispatch)
  }

  private canAddBlock = (type: Nodes, after: boolean, position?: number) => {
    const { state } = this.view

    if (position === undefined) {
      position = after ? this.getPos() + this.node.nodeSize : this.getPos()
    }

    const $position = this.view.state.doc.resolve(position)

    const index = $position.index()

    const nodeType = state.schema.nodes[type]

    return $position.parent.canReplaceWith(index, index, nodeType)
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
    figureElement: this.canAddBlock('figure_element', after),
    tableElement: this.canAddBlock('table_element', after),
    equationElement: this.canAddBlock('equation_element', after),
    listingElement: this.canAddBlock('listing_element', after),
  })

  private showMenuSection = (
    insertableTypes: { [key: string]: boolean },
    types: string[]
  ) => types.some(type => insertableTypes[type])

  private changeNodeType = (type: string) => {
    const nodeType = this.view.state.schema.nodes[type]

    this.view.dispatch(
      this.view.state.tr.setNodeMarkup(this.getPos(), nodeType, {
        id: this.node.attrs.id,
      })
    )

    popper.destroy()
  }

  private deleteNode = (nodeType: Nodes) => {
    switch (nodeType) {
      case 'section_title': {
        const $pos = this.resolvePos()

        this.view.dispatch(
          this.view.state.tr.delete($pos.before(), $pos.after())
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

  private resolvePos = () => this.view.state.doc.resolve(this.getPos())

  private splitSection = () => {
    const { schema, tr } = this.view.state

    const from = this.getPos()
    const to = from + this.node.nodeSize

    const slice = new Slice(
      Fragment.from([
        schema.nodes.section.create(),
        schema.nodes.section.create({}, [
          schema.nodes.section_title.create(),
          this.node,
        ]),
      ]),
      1,
      1
    )

    this.view.dispatch(tr.replaceRange(from, to, slice))
  }

  private toggleNodeAttr = (option: SuppressOption) => {
    const { getPos, attr, attrs } = option

    this.view.dispatch(
      this.view.state.tr.setNodeMarkup(getPos(), undefined, {
        ...attrs,
        [attr]: !attrs[attr],
      })
    )
  }

  private parentAttrs = () => {
    const $pos = this.resolvePos()

    return $pos.parent.attrs
  }

  private getParentPos = () => {
    const $pos = this.resolvePos()

    return $pos.before()
  }

  private isListType = (type: string) =>
    ['bullet_list', 'ordered_list'].includes(type)

  private buildSuppressOptions = () => {
    const items: SuppressOption[] = []

    const attrs = this.node.attrs

    for (const [attr, label] of this.suppressibleAttrs.entries()) {
      if (attr in attrs) {
        items.push({
          attr,
          attrs,
          label,
          getPos: this.getPos,
        })
      }
    }

    switch (this.node.type.name) {
      case 'section':
        items.push({
          attr: 'titleSuppressed',
          attrs,
          label: 'Heading',
          getPos: this.getPos,
        })
        break

      case 'section_title':
        items.push({
          attr: 'titleSuppressed',
          attrs: this.parentAttrs(),
          label: 'Heading',
          getPos: this.getParentPos,
        })
        break
    }

    return items
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
