import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeView } from 'prosemirror-view'
import React from 'react'
import ReactDOM from 'react-dom'
import CitationEditor from '../../../components/CitationEditor'
import ComponentsProvider from '../../../store/ComponentsProvider'
import KeywordsProvider from '../../../store/KeywordsProvider'
import { ThemeProvider } from '../../../theme'
import { BibliographyItem, Citation } from '../../../types/components'
import { EditorProps, SaveComponent } from '../../Editor'
import { NodeViewCreator } from '../types'

class CitationView implements NodeView {
  public dom: HTMLElement

  private readonly props: EditorProps
  private node: ProsemirrorNode

  constructor(props: EditorProps, node: ProsemirrorNode) {
    this.props = props
    this.node = node

    this.createDOM()
  }

  public update(newNode: ProsemirrorNode) {
    if (!newNode.sameMarkup(this.node)) return false
    this.node = newNode
    this.props.popper.update()
    return true
  }

  public stopEvent(event: Event) {
    // https://discuss.prosemirror.net/t/draggable-and-nodeviews/955/13
    return event.type !== 'mousedown' && !event.type.startsWith('drag')
  }

  public ignoreMutation() {
    return true
  }

  public selectNode() {
    const { getComponent, getLibraryItem } = this.props
    const citation = getComponent<Citation>(this.node.attrs.rid)

    const items = citation.embeddedCitationItems.map(citationItem =>
      getLibraryItem(citationItem.bibliographyItem)
    )

    const container = document.createElement('div')
    container.className = 'citation-editor'

    ReactDOM.render(
      <ThemeProvider>
        <ComponentsProvider>
          <KeywordsProvider>
            <CitationEditor
              items={items}
              handleSave={this.handleSave}
              // handleDelete={this.handleDelete}
            />
          </KeywordsProvider>
        </ComponentsProvider>
      </ThemeProvider>,
      container
    )

    this.props.popper.show(this.dom, container, 'right')
  }

  public deselectNode() {
    this.props.popper.destroy()
  }

  private handleSave = async (item: BibliographyItem) => {
    this.props.popper.destroy()

    await (this.props.saveComponent as SaveComponent)(item)
  }

  // private handleDelete = async () => {
  //   this.props.popper.destroy()
  //
  //   await (this.props.deleteComponent as DeleteComponent)(this.node.attrs.id)
  // }

  private createDOM() {
    this.dom = document.createElement('span')
    this.dom.className = 'citation'
    // dom.id = node.attrs.id
    this.dom.setAttribute('data-reference-id', this.node.attrs.rid)
    this.dom.setAttribute('spellcheck', 'false')
    // dom.setAttribute('data-citation-items', node.attrs.citationItems.join('|'))
    this.dom.innerHTML = this.node.attrs.contents // TODO: sanitise!!?
  }
}

const citation = (props: EditorProps): NodeViewCreator => node =>
  new CitationView(props, node)

export default citation
