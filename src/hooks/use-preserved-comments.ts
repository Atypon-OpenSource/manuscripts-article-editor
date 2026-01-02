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
import { useCallback } from 'react'

import { useStore } from '../store'

export const usePreservedComments = () => {
  const [, dispatch, getState] = useStore((s) => s as any) as any

  const get = useCallback(
    (id: string): string | undefined => {
      const map = getState()?.preservedCommentContent as Map<string, string>
      return map?.get(id)
    },
    [getState]
  )

  const set = useCallback(
    (id: string, val: string) => {
      const currMap =
        (getState()?.preservedCommentContent as Map<string, string>) ||
        new Map()
      const existing = currMap.get(id)
      if (existing === val) {
        return
      }
      const next = new Map(currMap)
      next.set(id, val)
      dispatch({ preservedCommentContent: next })
    },
    [dispatch, getState]
  )

  const remove = useCallback(
    (id: string) => {
      const currMap =
        (getState()?.preservedCommentContent as Map<string, string>) ||
        new Map()
      if (!currMap.has(id)) {
        return
      }
      const next = new Map(currMap)
      next.delete(id)
      dispatch({ preservedCommentContent: next })
    },
    [dispatch, getState]
  )

  return { get, set, remove }
}
