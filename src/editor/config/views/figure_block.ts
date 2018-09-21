import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { buildFigure } from '../../../lib/commands'
import { EditorProps } from '../../Editor'
import placeholder from '../icons/png/Toolbar-InsertImage-N@2x.png'
import { componentsKey, INSERT } from '../plugins/components'
import { NodeViewCreator } from '../types'
import Block from './block'

// TODO: double-click to select in caption

class FigureBlock extends Block {
  private container: HTMLElement
  private element: HTMLElement

  public constructor(
    props: EditorProps,
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
  ) {
    super(props, node, view, getPos)

    this.initialise()
  }

  // TODO: does this need to be different?
  public update(newNode: ProsemirrorNode) {
    if (newNode.type.name !== this.node.type.name) return false
    if (newNode.attrs.id !== this.node.attrs.id) return false
    this.node = newNode
    this.contentDOM.classList.toggle(
      'hidden-caption',
      this.node.attrs.suppressCaption
    )
    this.updateContents()
    return true
  }

  public selectNode() {
    this.dom.classList.add('ProseMirror-selectednode')
  }

  public deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode')
  }

  public stopEvent(event: Event) {
    return event.type !== 'mousedown'
  }

  public ignoreMutation() {
    return true
  }

  protected get elementType() {
    return 'figure'
  }

  protected get objectName() {
    return 'Figure'
  }

  // TODO: load/subscribe to the figure style object from the database and use it here?
  protected createElement() {
    this.element = document.createElement(this.elementType)
    this.element.className = 'block'
    this.element.id = this.node.attrs.id
    this.element.setAttribute('data-figure-style', this.node.attrs.figureStyle)

    this.container = document.createElement('div')
    this.container.className = 'figure-panel'
    this.container.contentEditable = 'false'
    this.element.appendChild(this.container)

    this.contentDOM = document.createElement('div') // TODO: figcaption?
    this.element.appendChild(this.contentDOM)

    this.dom.appendChild(this.element)
  }

  protected updateContents() {
    const { getComponent } = componentsKey.getState(this.view.state)

    const { rows, columns, containedObjectIDs } = this.node.attrs

    const objects = containedObjectIDs.map(getComponent)

    while (this.container.hasChildNodes()) {
      this.container.removeChild(this.container.firstChild as Node)
    }

    let index = 0

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const img = document.createElement('img')
        img.className = 'figure'

        const image = objects[index]

        if (image) {
          img.src = image.src
        } else {
          img.src = placeholder
          img.classList.add('placeholder')
        }

        const input = document.createElement('input')
        input.accept = 'image/*'
        input.type = 'file'

        input.addEventListener('change', this.handleImage(index))

        img.addEventListener('click', () => {
          input.click()
        })

        // TODO: should "figure" be a node?
        const figureContainer = document.createElement('div')
        figureContainer.appendChild(img)

        if (image && image.title) {
          // TODO: depends on figure layout
          const title = document.createElement('div')
          title.textContent = image.title // TODO: can this be HTML?
          figureContainer.appendChild(title) // TODO: add label
        }

        // TODO: a popup editor for figure contents and metadata?

        this.container.appendChild(figureContainer)

        index++
      }
    }
  }

  private handleImage(index: number): EventListener {
    return event => {
      const input = event.target as HTMLInputElement

      if (!input.files) return

      Array.from(input.files).forEach((file, fileIndex) => {
        this.addImage(file, index + fileIndex)
      })
    }
  }

  private addImage(file: File, index: number) {
    const figure = buildFigure(file)

    // IMPORTANT: the array must be cloned here, not modified
    const containedObjectIDs = [...this.node.attrs.containedObjectIDs]
    containedObjectIDs[index] = figure.id

    this.view.dispatch(
      this.view.state.tr
        .setMeta(componentsKey, { [INSERT]: [figure] })
        .setNodeMarkup(this.getPos(), undefined, {
          ...this.node.attrs,
          containedObjectIDs,
        })
    )
  }
}

const figureBlock = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new FigureBlock(props, node, view, getPos)

export default figureBlock
