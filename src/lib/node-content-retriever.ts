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
  findNodeByID,
  getFootnoteLabel,
  metadata,
  objectsPluginKey,
} from '@manuscripts/body-editor'
import {
  BibliographyItemAttrs,
  FootnoteNode,
  ManuscriptEditorState,
  ManuscriptNode,
  schema,
} from '@manuscripts/transform'
import domPurify from 'dompurify'
export class NodeTextContentRetriever {
  private state: ManuscriptEditorState

  constructor(state: ManuscriptEditorState) {
    this.state = state
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
  public getContentFromBibliography(id: string, node: ManuscriptNode): string {
    const bibPlugin = bibliographyPluginKey.get(this.state)
    const bib = bibPlugin?.getState(this.state)
    if (!bib) {
      return ''
    }

    if (node.type === schema.nodes.citation) {
      const text = bib?.renderedCitations.get(id)
      const citation = domPurify.sanitize(
        text === '(n.d.)'
          ? 'Missing citation data'
          : text && text !== '[NO_PRINTED_FORM]'
          ? text
          : ' ',
        {
          ALLOWED_TAGS: ['i', 'b', 'span', 'sup', 'sub', '#text'],
        }
      )
      return citation ? citation.replace(/<[^>]*>/g, '') : ''
    } else {
      return `<span> ${
        node.attrs.title || node.attrs.literal || 'untitled'
      } </span> ${metadata(node.attrs as BibliographyItemAttrs)}`
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
    try {
      const objectsPlugin = objectsPluginKey.get(this.state)
      if (!objectsPlugin) {
        return ''
      }

      const pluginState = objectsPlugin.getState(this.state)
      if (!pluginState) {
        return ''
      }

      const target = pluginState.get(node.attrs.id)
      return target?.label || ''
    } catch (error) {
      console.error('Error getting figure label:', error)
      return ''
    }
  }

  /**
   * Retrieves the inline footnote content.
   */
  public getInlineFootnoteContent(
    state: ManuscriptEditorState,
    attrs: Record<any, any>
  ): string {
    const rid = attrs.rids[0]
    if (!rid) {
      return '?'
    }
    const footnote = findNodeByID(state.doc, rid)?.node
    if (!footnote) {
      return '?'
    }
    const label = getFootnoteLabel(state, footnote as FootnoteNode)
    const text = footnote.textContent ?? ''
    return `<sup class="footnote-decoration">${label}</sup>${text}`
  }

  /**
   * Retrieves the text content of a footnote node with decoration.
   */
  public getFootnoteContent(
    state: ManuscriptEditorState,
    node: ManuscriptNode
  ): string {
    const label = getFootnoteLabel(state, node as FootnoteNode)
    const text = node.textContent ?? ''
    return `<sup class="footnote-decoration">${label}</sup>${text}`
  }

  /**
   * Retrieves the text content of a footnote node with decoration.
   */
  public getAwardContent(node: ManuscriptNode): string {
    const text = node.attrs.source
    return `${text}`
  }
}
