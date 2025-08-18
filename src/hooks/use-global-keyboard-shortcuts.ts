/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import { activateSearch, activateSearchReplace } from '@manuscripts/body-editor'
import { useEffect } from 'react'

import { useStore } from '../store'

/**
 * Hook to handle global keyboard shortcuts that work even when the editor isn't focused.
 * Useful for viewer mode where users can't focus the editor but still need shortcuts,
 * and when users are elsewhere on the page (inspector).
 */
export const useGlobalKeyboardShortcuts = () => {
  const [editor] = useStore((state) => state.editor)

  useEffect(() => {
    const handleGlobalKeydown = (event: KeyboardEvent) => {
      // Cmd+F / Ctrl+F - Activate search
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault()
        if (editor?.view) {
          activateSearch(editor.view.state, editor.view.dispatch)
        }
        return
      }

      // Shift+Ctrl+h / Shift+Cmd+h - Activate search & replace
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === 'h'
      ) {
        event.preventDefault()
        if (editor?.view) {
          activateSearchReplace(editor.view.state, editor.view.dispatch)
        }
        return
      }
    }

    document.addEventListener('keydown', handleGlobalKeydown)
    return () => document.removeEventListener('keydown', handleGlobalKeydown)
  }, [editor?.view])
}
