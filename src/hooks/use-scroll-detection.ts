/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */

import { useRef, useState } from 'react'

export const useScrollDetection = (
  topTrigger: number,
  bottomTrigger: number
) => {
  const refRoot = useRef<HTMLDivElement | null>()
  const observer = useRef<() => void>()
  const [triggers, setTriggers] = useState({ bottom: false, top: false })

  const ref = (node: HTMLDivElement | null) => {
    if (!node) {
      return
    }
    refRoot.current = node

    if (refRoot.current && !observer.current) {
      const listener = () => {
        if (!refRoot.current) {
          return
        }
        const node = refRoot.current!
        if (node.scrollTop == 0) {
          node.scrollTop = 1
        }
        const topRatio = node.scrollTop / node.offsetHeight
        const bottomRatio =
          1 -
          (node.scrollHeight - node.offsetHeight - node.scrollTop) /
            node.offsetHeight

        const newVal = { top: false, bottom: false }
        newVal.top = topRatio <= topTrigger

        newVal.bottom = Math.round(bottomRatio * 100) / 100 >= bottomTrigger

        setTriggers(newVal)
      }
      refRoot.current.addEventListener('scroll', listener)
      observer.current = listener
    }
  }

  return { ref, triggers }
}
