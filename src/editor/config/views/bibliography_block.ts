import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { Purify } from '../../lib/dompurify'
import { NodeViewCreator } from '../types'
import AbstractBlock from './abstract_block'

class BibliographyBlock extends AbstractBlock {
  private element: HTMLElement
  private readonly imports: {
    purify: Promise<Purify>
  }

  public constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
  ) {
    super(node, view, getPos)

    this.imports = {
      purify: import(/* webpackChunkName: "dompurify" */ '../../lib/dompurify'),
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
    return true
  }

  public stopEvent() {
    return true
  }

  public ignoreMutation() {
    return true
  }

  protected get elementType() {
    return 'div'
  }

  protected get objectName() {
    return 'Bibliography'
  }

  protected async updateContents() {
    try {
      const { sanitize } = await this.imports.purify
      this.element.innerHTML = sanitize(this.node.attrs.contents)
    } catch (e) {
      console.error(e) // tslint:disable-line:no-console
      // TODO: improve the UI for presenting offline/import errors
      window.alert(
        'There was an error loading the HTML purifier, please reload to try again'
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

const bibliographyBlock: NodeViewCreator = (node, view, getPos) =>
  new BibliographyBlock(node, view, getPos)

export default bibliographyBlock
