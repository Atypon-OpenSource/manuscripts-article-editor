/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import {
  bibliographyPluginKey,
  footnotesPluginKey,
  objectsPluginKey,
} from '@manuscripts/body-editor'
import {
  ManuscriptEditorState,
  ManuscriptNode,
  ManuscriptNodeType,
  schema,
} from '@manuscripts/transform'

export class NodeTextContentRetriever {
  private state: ManuscriptEditorState

  constructor(state: ManuscriptEditorState) {
    this.state = state
  }

  /**
   * Recursively retrieves text content from a ManuscriptNode.
   */
  public getNodeTextContent(node: ManuscriptNode): string {
    let textContent = ''
    const isWrapper = node.type.spec.isWrapper
    if (!isWrapper) {
      node.forEach((child) => {
        if (child.isText) {
          textContent += child.text
        } else {
          textContent += this.getNodeTextContent(child)
        }
      })
    }
    return textContent
  }

  /**
   * Retrieves the text content of the first child node.
   */
  public getFirstChildContent(node: ManuscriptNode): string {
    return node.firstChild ? node.firstChild.textContent : ''
  }

  /**
   * Retrieves the text content from a bibliography node.
   */
  public getContentFromBibliography(
    id: string,
    nodeType: ManuscriptNodeType
  ): string {
    const bibPlugin = bibliographyPluginKey.get(this.state)
    const bib = bibPlugin?.getState(this.state)
    if (!bib) {
      return ''
    }

    if (nodeType === schema.nodes.citation) {
      const citation = bib?.renderedCitations.get(id)
      return citation ? citation.replace(/<[^>]*>/g, '') : ''
    } else {
      const [meta, bibliography] = bib.provider.makeBibliography()
      const selectedBib = meta.entry_ids.findIndex(
        (entry: [string]) => entry[0] === id
      )
      const parser = new DOMParser()
      const textContent = parser.parseFromString(
        bibliography[selectedBib],
        'text/html'
      ).body.textContent
      return textContent || ''
    }
  }

  /**
   * Retrieves the content of an equation node.
   */
  public getEquationContent(node: ManuscriptNode): string {
    if (node.firstChild && node.type === schema.nodes.equation_element) {
      return node.firstChild.attrs.contents
    } else if (node) {
      return node.attrs.contents
    }
    return ''
  }

  /**
   * Retrieves the label of a figure node.
   */
  public getFigureLabel(node: ManuscriptNode): string {
    const objectsPlugin = objectsPluginKey.get(this.state)
    const pluginState = objectsPlugin?.getState(this.state)
    const target = pluginState?.get(node.attrs.id)
    return target?.label || ''
  }

  /**
   * Finds a footnote node by its ID.
   */
  private findFootnoteById(
    doc: ManuscriptNode,
    id: string
  ): ManuscriptNode | null {
    let footnoteNode: ManuscriptNode | null = null

    doc.descendants((node) => {
      if (node.type === schema.nodes.footnote && node.attrs.id === id) {
        footnoteNode = node
        return false
      }
      return !footnoteNode
    })
    return footnoteNode
  }

  /**
   * Retrieves the inline footnote content.
   */
  public getInlineFootnoteContent(
    doc: ManuscriptNode,
    attrs: Record<any, any>
  ): string {
    const footnote =
      attrs.rids && attrs.rids.length > 0
        ? this.findFootnoteById(doc, attrs.rids[0])
        : null

    return `<sup class="footnote-decoration">${attrs.contents || ''}</sup>${
      footnote ? footnote.textContent : ''
    }`
  }

  /**
   * Retrieves the text content of a footnote node with decoration.
   */
  public getFootnoteContent(node: ManuscriptNode): string {
    const footnotesPlugin = footnotesPluginKey.get(this.state)
    const pluginState = footnotesPlugin?.getState(this.state)
    const decorationText = pluginState?.labels.get(node.attrs.id) || ''

    return `<sup class="footnote-decoration">${decorationText}</sup>${this.getNodeTextContent(
      node
    )}`
  }
}
