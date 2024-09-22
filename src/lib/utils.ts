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
import { getActualAttrs, renderMath } from '@manuscripts/body-editor'
import {
  ManuscriptEditorState,
  ManuscriptNode,
  schema,
} from '@manuscripts/transform'
import { EditorState, Plugin } from 'prosemirror-state'
interface ExtendedPlugin extends Plugin {
  key: string
}

export const getNodeTextContent = (node: ManuscriptNode) => {
  let textContent = ''
  node.forEach((child) => {
    if (child.isText) {
      // If the child is a text node, add its text content
      textContent += child.text
    } else {
      // If the child is not a text node, recursively collect text content
      textContent += getNodeTextContent(child)
    }
  })

  return textContent
}

export const getContributorTextContent = (
  node: ManuscriptNode,
  oldAttrs: Record<any, any> | undefined
) => {
  let textContent = ''
  textContent += `${node.attrs.bibliographicName.given} ${node.attrs.bibliographicName.family}`
  if (oldAttrs) {
    textContent =
      `${oldAttrs.bibliographicName.given} ${oldAttrs.bibliographicName.family} to ` +
      textContent
  }
  return textContent
}

export const getAffiliationTextContent = (
  node: ManuscriptNode,
  oldAttrs: Record<any, any> | undefined
) => {
  let textContent = ''
  textContent += `${node.attrs.institution}`
  if (oldAttrs) {
    textContent = `${oldAttrs.institution} to ` + textContent
  }
  return textContent
}

export const findBibliographyById = (
  doc: ManuscriptNode,
  id: string
): ManuscriptNode | null => {
  let bibNode: ManuscriptNode | null = null

  doc.descendants((node) => {
    if (node.type === schema.nodes.bibliography_item && node.attrs.id === id) {
      bibNode = node
      return false // stop traversal
    }
    if (bibNode) {
      return false
    }
    return true // continue traversal
  })
  return bibNode
}

export const getTextContentFromBibliography = (
  state: ManuscriptEditorState,
  id: string
): string => {
  const bib = findPluginByKey(state, 'bibliography')?.getState(state)
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

export const getFigureLabel = (
  state: ManuscriptEditorState,
  node: ManuscriptNode
) => {
  const objectsPlugin = findPluginByKey(state, 'objects')
  const pluginState = objectsPlugin?.getState(state)
  const target = pluginState?.get(node.attrs.id)
  return target?.label || ''
}

export const findPluginByKey = (
  state: ManuscriptEditorState,
  keyName: string
): ExtendedPlugin | null => {
  for (let i = 0; i < state.plugins.length; i++) {
    const plugin = state.plugins[i] as ExtendedPlugin

    if (plugin.key === keyName + '$') {
      return plugin
    }
  }
  return null
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
  const footnotesPlugin = findPluginByKey(state, 'footnotes')
  const pluginState = footnotesPlugin?.getState(state)
  let decorationText = ''
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
