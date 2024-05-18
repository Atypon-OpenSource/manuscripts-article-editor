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
import React, { useEffect } from 'react'

import { scrollIntoViewIfNeeded } from '../lib/scroll'
import { useStore } from '../store'

export const SelectionStyles: React.FC = () => {
  const [{ selectedSuggestionID }, dispatch] = useStore((state) => ({
    selectedSuggestionID: state.selectedSuggestionID,
  }))

  useEffect(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const editor = target.closest('#editor')
      if (!editor) {
        return
      }
      const suggestion = target.closest('[data-track-id]') as HTMLElement
      dispatch({
        selectedSuggestionID: suggestion?.dataset.trackId,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedSuggestionID) {
      return
    }
    const suggestion = document.querySelector(
      `[data-track-id="${selectedSuggestionID}"]`
    )
    suggestion && scrollIntoViewIfNeeded(suggestion)
  }, [selectedSuggestionID])

  const style = selectedSuggestionID
    ? `
[data-track-id="${selectedSuggestionID}"] {
  background: #bce7f6 !important;
  border-width: 2px 0 2px 0 !important;
  border-color: #20aedf !important;
  border-radius: 3px !important;
  border-style: solid !important;
}
`
    : ''

  return <style>{style}</style>
}
