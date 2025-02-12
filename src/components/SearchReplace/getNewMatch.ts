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

export function getNewMatch(
  side: 'left' | 'right',
  current: number,
  selection: { from: number; to: number },
  matches: { from: number; to: number }[]
) {
  if (current < 0) {
    // it means we need to recalc againt the new pointer
    return getClosestMatch(side, selection, matches)
  }

  let newMatch = 0
  if (side == 'left') {
    newMatch = current - 1 >= 0 ? current - 1 : matches.length - 1
  }
  if (side == 'right') {
    newMatch = current + 1 < matches.length ? current + 1 : 0
  }
  return newMatch
}

function getClosestMatch(
  side: 'left' | 'right',
  selection: { from: number; to: number },
  matches: { from: number; to: number }[]
) {
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    if (
      side == 'right' &&
      match.from > selection.to &&
      (!matches[i - 1] || matches[i - 1].to <= selection.to)
    ) {
      return i
    }

    if (
      side == 'left' &&
      match.from < selection.from &&
      (!matches[i + 1] || matches[i + 1].from >= selection.from)
    ) {
      return i
    }
  }
}
