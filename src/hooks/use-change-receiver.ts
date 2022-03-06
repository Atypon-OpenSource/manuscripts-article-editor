/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

/* IDLE COMPONENT */

import { useEditor } from '@manuscripts/manuscript-editor'
import {
  ContainedModel,
  isFigure,
  ManuscriptEditorState,
  ManuscriptModel,
} from '@manuscripts/manuscript-transform'
import { Model } from '@manuscripts/manuscripts-json-schema'
import {
  RxChangeEventInsert,
  RxChangeEventRemove,
  RxChangeEventUpdate,
} from '@manuscripts/rxdb'

import sessionID from '../lib/session-id'
import { useManuscriptModels } from './use-manuscript-models'

type Change =
  | RxChangeEventInsert<ContainedModel>
  | RxChangeEventUpdate<ContainedModel>
  | RxChangeEventRemove<ContainedModel>

const getNodePositionById = (state: ManuscriptEditorState, id: string) => {
  let pos: number | undefined
  state.doc.descendants((node, nodePos) => {
    if (node.attrs.id === id) {
      pos = nodePos
      return false
    }
    return true
  })
  return pos
}

export const changeReceiver = (
  editor: ReturnType<typeof useEditor>,
  change: Change,
  saveModel: <T extends Model>(model: T | Partial<T>) => Promise<T>,
  deleteModel: (id: string) => Promise<string>
) => {
  // don't worry about remove events FOR NOW
  // don't worry about insert events because figures have to be created in
  // the editor somewhere to require a transaction
  if (change.data.doc.startsWith('MPExternalFile:')) {
    const model = change.data.v as Model
    if (change.data.op !== 'REMOVE') {
      saveModel(model)
    } else {
      deleteModel(model._id)
    }
  }

  if (change.data.op !== 'UPDATE') {
    return
  }

  const model = change.data.v as Model

  if (isFigure(model)) {
    const { selection, tr } = editor.state

    const pos = getNodePositionById(editor.state, model._id)
    if (!pos) {
      return
    }

    tr.setNodeMarkup(pos, undefined, { src: model.src }).setSelection(
      selection.map(tr.doc, tr.mapping)
    )

    editor.dispatch(tr)
  }

  // TODO: other types of nodes/transactions
}

export const useChangeReceiver = (
  editor: ReturnType<typeof useEditor>,
  saveModel: <T extends Model>(model: T | Partial<T>) => Promise<T>,
  deleteModel: (id: string) => Promise<string>
) => {
  const { collection, containerID, manuscriptID } = useManuscriptModels()

  return collection.getCollection().$.subscribe((change) => {
    const model = change.data.v as Model

    // ignore changes to local documents
    if (model._id.startsWith('_local/')) {
      return
    }

    // ignore changes to other projects
    if ((model as ContainedModel).containerID !== containerID) {
      return
    }

    // ignore changes to other manuscripts
    if (
      (model as ManuscriptModel).manuscriptID &&
      (model as ManuscriptModel).manuscriptID !== manuscriptID
    ) {
      return
    }

    // only use updates from other sessions
    if (model.sessionID === sessionID) {
      return
    }

    return changeReceiver(editor, change, saveModel, deleteModel)
  })
}
