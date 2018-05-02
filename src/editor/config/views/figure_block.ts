import { Node as ProsemirrorNode } from 'prosemirror-model'
import { generateID } from '../../../transformer/id'
import nodeTypes from '../../../transformer/node-types'
import { Figure } from '../../../types/components'
import placeholder from '../icons/png/Toolbar-InsertImage-N@2x.png'
import { componentsKey, INSERT } from '../plugins/components'
import { NodeViewCreator } from '../types'
import Block from './block'

// TODO: double-click to select in caption

class FigureBlock extends Block {
  private container: HTMLElement
  private element: HTMLElement

  // TODO: does this need to be different?
  public update(newNode: ProsemirrorNode) {
    if (newNode.attrs.type !== this.node.attrs.type) return false
    if (newNode.attrs.id !== this.node.attrs.id) return false
    this.node = newNode
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
    const figure: Figure = {
      id: generateID('figure_image') as string,
      objectType: nodeTypes.get('figure_image') as string,
      contentType: file.type,
      src: window.URL.createObjectURL(file),
      attachment: {
        id: file.name,
        type: file.type,
        data: file,
      },
    }

    const containedObjectIDs = this.node.attrs.containedObjectIDs
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

const figureBlock: NodeViewCreator = (node, view, getPos) =>
  new FigureBlock(node, view, getPos)

export default figureBlock
