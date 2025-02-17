/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2021 Atypon Systems LLC. All Rights Reserved.
 */

import { ManuscriptNode } from '@manuscripts/transform'
import { useEffect } from 'react'

import { getNodeRealText } from '../lib/get-node-without-tc'
import { useStore } from '../store'

export function useWatchTitle() {
  const [doc, dispatch] = useStore((state) => state.doc)
  const [prevText] = useStore((state) => state.titleText)

  useEffect(() => {
    let newTitleNode: ManuscriptNode | null = null

    doc.descendants((node, pos) => {
      if (newTitleNode) {
        return false
      }
      if (node.type === node.type.schema.nodes.title) {
        newTitleNode = node
      }
    })

    if (newTitleNode) {
      const node = newTitleNode as ManuscriptNode

      const newRealText = getNodeRealText(node)

      if (newRealText !== prevText) {
        dispatch({ titleText: getNodeRealText(node) })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc])
}
