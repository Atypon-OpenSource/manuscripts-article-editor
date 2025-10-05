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
import { ManuscriptEditorState, ManuscriptNode } from '@manuscripts/transform'

export type PMDoc = ManuscriptNode

export type ManuscriptSnapshot = {
  id: string
  name: string
  snapshot: PMDoc
  createdAt: string
}

export type ManuscriptDoc = {
  doc: PMDoc
  version: number
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
