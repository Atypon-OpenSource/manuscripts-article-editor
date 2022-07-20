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

import { iterateChildren } from '@manuscripts/manuscript-editor'
import {
  FigureNode,
  ManuscriptNode,
  schema,
} from '@manuscripts/manuscript-transform'
import { Figure } from '@manuscripts/manuscripts-json-schema'
import { EditorState, Transaction } from 'prosemirror-state'
import { ContentNodeWithPos } from 'prosemirror-utils'
import React from 'react'

import { useStore } from '../../store'
import { FigureInspector } from './FigureInspector'

export const NodeInspector: React.FC<{
  selected: ContentNodeWithPos
  state: EditorState
  dispatch: (tr: Transaction) => EditorState | void
}> = ({ selected, state, dispatch }) => {
  const [modelMap] = useStore((store) => store.modelMap)
  const [saveModel] = useStore((store) => store.saveModel)
  switch (selected.node.type) {
    case schema.nodes.figure_element: {
      const figures = []

      for (const child of iterateChildren(selected.node as ManuscriptNode)) {
        if (child.type === schema.nodes.figure) {
          figures.push(child)
        }
      }

      if (figures.length === 1) {
        const [node] = figures

        const figure = modelMap.get(node.attrs.id) as Figure | undefined

        if (figure) {
          return (
            <FigureInspector
              figure={figure}
              node={node as FigureNode}
              saveFigure={saveModel}
              state={state}
              dispatch={dispatch}
            />
          )
        }
      }

      return null
    }

    case schema.nodes.figure: {
      const figure = modelMap.get(selected.node.attrs.id) as Figure | undefined

      if (figure) {
        return (
          <FigureInspector
            figure={figure}
            node={(selected.node as unknown) as FigureNode}
            saveFigure={saveModel}
            state={state}
            dispatch={dispatch}
          />
        )
      }

      return null
    }

    default:
      return null
  }
}
