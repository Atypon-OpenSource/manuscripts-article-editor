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
import { EditorState } from 'prosemirror-state'

export const getNodeTextContent = (node: ManuscriptNode) => {
  let textContent = ''
  const isWrapper = node.type.spec.isWrapper
  if (!isWrapper) {
    node.forEach((child) => {
      if (child.isText) {
        // If the child is a text node, add its text content
        textContent += child.text
      } else {
        // If the child is not a text node, recursively collect text content
        textContent += getNodeTextContent(child)
      }
    })
  }

  return textContent
}

export const getFirstChildContent = (node: ManuscriptNode) => {
  if (node.firstChild) {
    return node.firstChild.textContent
  }
  return ''
}

export const getContributorTextContent = (
  node: ManuscriptNode,
  oldAttrs: Record<any, any> | undefined
) => {
  return `${node.attrs.bibliographicName.given} ${node.attrs.bibliographicName.family}`
}

export const getAffiliationTextContent = (node: ManuscriptNode) => {
  return node.attrs.institution
}

export const getTextContentFromBibliography = (
  state: ManuscriptEditorState,
  id: string,
  nodeType: ManuscriptNodeType
): string => {
  const bibPlugin = bibliographyPluginKey.get(state)
  const bib = bibPlugin?.getState(state)
  if (!bib) {
    return ''
  }
  if (nodeType === schema.nodes.citation) {
    const citation = bib?.renderedCitations.get(id)
    return citation ? citation.replace(/<[^>]*>/g, '') : ''
  } else {
    const [meta, bibliography] = bib.provider.makeBibliography()
    const selectedBib = meta.entry_ids.findIndex(
      (entry: [string]) => entry[0] == id
    )
    const parser = new DOMParser()
    const textContent = parser.parseFromString(
      bibliography[selectedBib],
      'text/html'
    ).body.textContent
    return textContent ? textContent : ''
  }
}

export const getFigureLabel = (
  state: ManuscriptEditorState,
  node: ManuscriptNode
) => {
  const objectsPlugin = objectsPluginKey.get(state)
  const pluginState = objectsPlugin?.getState(state)
  const target = pluginState?.get(node.attrs.id)
  return target?.label || ''
}

export const getEquationContent = (node: ManuscriptNode) => {
  if (node.firstChild && node.type === schema.nodes.equation_element) {
    return node.firstChild.attrs.contents
  } else if (node) {
    return node.attrs.contents
  }
  return ''
}

export const findFootnoteById = (
  doc: ManuscriptNode,
  id: string
): ManuscriptNode | null => {
  let footnoteNode: ManuscriptNode | null = null

  doc.descendants((node) => {
    if (node.type === schema.nodes.footnote && node.attrs.id === id) {
      footnoteNode = node
      return false
    }
    if (footnoteNode) {
      return false
    }
    return true
  })
  return footnoteNode
}

export const getInlineFootnoteContent = (
  doc: ManuscriptNode,
  attrs: Record<any, any>
): string => {
  let footnote = null
  if (attrs.rids && attrs.rids.length > 0) {
    footnote = findFootnoteById(doc, attrs.rids[0])
  }
  return `<sup class="footnote-decoration">${
    attrs.contents ? attrs.contents : ''
  }</sup>${footnote ? footnote.textContent : ''}`
}

export const getFootnoteText = (
  state: ManuscriptEditorState,
  node: ManuscriptNode
) => {
  let decorationText
  const footnotesPlugin = footnotesPluginKey.get(state)
  const pluginState = footnotesPlugin?.getState(state)
  if (pluginState) {
    decorationText = pluginState.labels.get(node.attrs.id)
  }
  return `<sup class="footnote-decoration">${
    decorationText ? decorationText : ''
  }</sup>${getNodeTextContent(node)}`
}

export const getParentNode = (state: EditorState, pos: number) => {
  const resolvedPos = state.doc.resolve(pos)

  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const parent = resolvedPos.node(depth)
    if (parent.isText === false) {
      return parent
    }
  }

  return null
}
