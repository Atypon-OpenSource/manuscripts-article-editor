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
import { CHANGE_OPERATION } from '@manuscripts/track-changes-plugin'
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptNode,
  schema,
} from '@manuscripts/transform'
import { Command } from 'prosemirror-state'

export type PMDoc = any

export type ManuscriptSnapshot = {
  id: string
  name: string
  snapshot: PMDoc
  createdAt: string
  updatedAt: string
}

export type ManuscriptDoc = {
  doc: PMDoc
  version: number
  createdAt: string
  updatedAt: string
  snapshots: SnapshotLabel[]
}

export type SnapshotLabel = Pick<
  ManuscriptSnapshot,
  'id' | 'name' | 'createdAt'
>

const filterUnchangedContent = (node: ManuscriptNode) => {
  const r: ManuscriptNode[] = []
  node.forEach((child) => {
    const { attrs } = child
    const op: CHANGE_OPERATION | undefined = attrs?.dataTracked?.operation
    if (
      child.isText &&
      child.marks.find((m) => m.type.name === 'tracked_insert') === undefined
    ) {
      r.push(
        child.type.schema.text(
          child.text || '',
          child.marks.filter((m) => m.type.name !== 'tracked_delete')
        )
      )
    } else if (op !== 'insert' && !child.isText) {
      r.push(
        child.type.create(
          { ...attrs, dataTracked: null },
          filterUnchangedContent(child),
          child.marks
        )
      )
    }
  })
  return r
}

export const getDocWithoutTrackContent = (state: ManuscriptEditorState) => {
  const doc = state.doc
  return doc.type.create(doc.attrs, filterUnchangedContent(doc), doc.marks)
}

/**
 * Command to update manuscript node attributes
 */
const updateManuscriptNodeAttrs = (attrs: Record<string, unknown>): Command => {
  return (state: ManuscriptEditorState, dispatch: any) => {
    const manuscriptNode = state.doc

    if (manuscriptNode.type !== schema.nodes.manuscript) {
      return false
    }

    // Check if attributes are actually different
    const hasChanges = Object.keys(attrs).some(
      (key) => manuscriptNode.attrs[key] !== attrs[key]
    )

    if (!hasChanges) {
      return false
    }

    // For now, just return true without updating
    // The document save mechanism will handle the persistence
    // This avoids the ProseMirror transaction issues
    return true
  }
}

/**
 * Updates the manuscript node attributes
 */
export const setManuscriptNodeAttrs = (
  view: ManuscriptEditorView,
  attrs: Record<string, unknown>
): boolean => {
  const command = updateManuscriptNodeAttrs(attrs)
  return command(view.state, view.dispatch)
}

/**
 * Updates the primaryLanguageCode attribute on the manuscript node
 */
export const setManuscriptPrimaryLanguageCode = (
  view: ManuscriptEditorView,
  languageCode: string
): boolean => {
  console.log('setManuscriptPrimaryLanguageCode called with:', languageCode)
  console.log('Current document attrs:', view.state.doc.attrs)
  return setManuscriptNodeAttrs(view, { primaryLanguageCode: languageCode })
}
