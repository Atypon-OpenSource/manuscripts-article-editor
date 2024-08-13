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
import { findParentSection } from '@manuscripts/body-editor'
import { Section } from '@manuscripts/json-schema'
import { SectionNode } from '@manuscripts/transform'
import { EditorState, Transaction } from 'prosemirror-state'
import React from 'react'

import { useStore } from '../../store'
import { ManuscriptInspector } from './ManuscriptInspector'

export const ContentTab: React.FC<{
  state: EditorState
  dispatch: (tr: Transaction) => EditorState
}> = ({ dispatch, state }) => {
  const [{ manuscript, modelMap }] = useStore((store) => {
    return {
      manuscript: store.manuscript,
      modelMap: store.trackModelMap,
    }
  })

  let sectionNode
  let section
  if (state.selection) {
    sectionNode = findParentSection(state.selection)?.node as SectionNode
    if (sectionNode) {
      section = modelMap.get(sectionNode.attrs.id) as Section
    }
  }

  const dispatchNodeAttrs = (
    id: string,
    attrs: Record<string, unknown>,
    nodispatch = false
  ) => {
    const { tr, doc } = state
    let transaction

    doc.descendants((node, pos) => {
      if (node.attrs.id === id) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          ...attrs,
        })
        if (nodispatch) {
          transaction = tr
        } else {
          dispatch(tr)
        }
      }
    })
    return transaction
  }

  return (
    <div>
      <ManuscriptInspector
        key={manuscript._id}
        state={state}
        dispatch={dispatch}
      />
    </div>
  )
}
