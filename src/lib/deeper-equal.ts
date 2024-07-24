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

const deeperEqual = (next: any, prev: any) => {
  // checking only one level deeper is enough to provide render relevenat equality
  if (!next) {
    return false
  }
  if (typeof prev == 'undefined' && typeof next !== 'undefined') {
    return false
  }
  switch (next.constructor.name) {
    case 'Object':
      return !Object.keys(next).find((i) => {
        if (prev[i] !== next[i]) {
          return true
        }
        return false
      })

    case 'Map': // important for modelMap
      if (next == prev) {
        return true
      }
      if (next.size == prev.size) {
        for (const [key, value] of next) {
          const prevPeer = prev.get(key)
          if (!prevPeer || prevPeer !== value) {
            return false
          }
        }
        return true
      }
      return false
    case 'Array':
      if (Array.isArray(prev)) {
        if (next.length !== prev.length) {
          return false
        }
        for (let i = 0; i < next.length; i++) {
          if (next[i] !== prev[i]) {
            return false
          }
        }

        return true
      }
      return false
    default:
      return next === prev
  }
}

export default deeperEqual
