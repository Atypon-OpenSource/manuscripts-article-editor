import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeView } from 'prosemirror-view'
import React from 'react'
import ReactDOM from 'react-dom'
import CitationEditor from '../../../components/library/CitationEditor'
import KeywordsProvider from '../../../store/KeywordsProvider'
import ModelsProvider from '../../../store/ModelsProvider'
import { ThemeProvider } from '../../../theme'
import { BibliographyItem, Citation, CitationItem } from '../../../types/models'
import { EditorProps } from '../../Editor'
import { Purify } from '../../lib/dompurify'
import { NodeViewCreator } from '../types'

class CitationView implements NodeView {
  public dom: HTMLElement

  private readonly props: EditorProps
  private node: ProsemirrorNode
  private readonly imports: {
    purify: Promise<Purify>
  }

  constructor(props: EditorProps, node: ProsemirrorNode) {
    this.props = props
    this.node = node

    this.imports = {
      purify: import(/* webpackChunkName: "dompurify" */ '../../lib/dompurify'),
    }

    this.initialise()
  }

  public update(newNode: ProsemirrorNode) {
    if (!newNode.sameMarkup(this.node)) return false
    this.node = newNode
    this.updateContents() // tslint:disable-line:no-floating-promises
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
    const { getModel, getLibraryItem, projectID } = this.props

    const { rid } = this.node.attrs

    const citation = rid ? getModel<Citation>(rid) : undefined

    // TODO: handle missing objects?
    // https://gitlab.com/mpapp-private/manuscripts-frontend/issues/395
    if (!citation) return

    const items = citation.embeddedCitationItems.map(
      (citationItem: CitationItem) =>
        getLibraryItem(citationItem.bibliographyItem)
    )

    const container = document.createElement('div')
    container.className = 'citation-editor'

    ReactDOM.render(
      <ThemeProvider>
        <ModelsProvider>
          <KeywordsProvider>
            <CitationEditor
              items={items}
              handleSave={this.handleSave}
              // handleDelete={this.handleDelete}
              projectID={projectID}
            />
          </KeywordsProvider>
        </ModelsProvider>
      </ThemeProvider>,
      container
    )

    this.props.popper.show(this.dom, container, 'right')
  }

  public deselectNode() {
    this.props.popper.destroy()
  }

  private initialise() {
    this.createDOM()
    this.updateContents() // tslint:disable-line:no-floating-promises
  }

  private handleSave = async (item: BibliographyItem) => {
    this.props.popper.destroy()

    await this.props.saveModel(item)
  }

  // private handleDelete = async () => {
  //   this.props.popper.destroy()
  //
  //   await (this.props.deleteModel as DeleteModel)(this.node.attrs.id)
  // }

  private createDOM() {
    this.dom = document.createElement('span')
    this.dom.className = 'citation'
    // dom.id = node.attrs.id
    this.dom.setAttribute('data-reference-id', this.node.attrs.rid)
    this.dom.setAttribute('spellcheck', 'false')
    // dom.setAttribute('data-citation-items', node.attrs.citationItems.join('|'))
  }

  private async updateContents() {
    const { sanitize } = await this.imports.purify

    this.dom.innerHTML = sanitize(this.node.attrs.contents) // TODO: whitelist
  }
}

const citation = (props: EditorProps): NodeViewCreator => node =>
  new CitationView(props, node)

export default citation
