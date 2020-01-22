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

import { useCallback } from 'react'

export const useCrisp = () => {
  const open = useCallback(
    (event?: React.MouseEvent) => {
      event && event.preventDefault()
      if (!window.$crisp) return
      window.$crisp.push(['do', 'chat:open'])
    },
    [window.$crisp]
  )

  const setMessageText = useCallback(
    (text: string) => {
      if (!window.$crisp) return
      open()
      window.$crisp.push(['set', 'message:text', [text]])
    },
    [window.$crisp]
  )

  const sendDiagnostics = useCallback(
    (message: string, diagnostics: string) => {
      if (!window.$crisp) return
      open()
      const dataUrl = window.URL.createObjectURL(new Blob([diagnostics]))
      window.$crisp.push(['do', 'message:send', [message]])
      window.$crisp.push([
        'do',
        'message:send',
        [
          'file',
          { name: 'diagnostics.json', url: dataUrl, type: 'application/json' },
        ],
      ])
    },
    [window.$crisp]
  )

  return {
    open,
    setMessageText,
    sendDiagnostics,
  }
}
