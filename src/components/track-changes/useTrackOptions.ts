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
import React, { useEffect, useState } from 'react'

import type { TrackOptions } from './TrackOptions'

function useTrackOptions(storageKey: string, initial?: Partial<TrackOptions>) {
  const [options, setOptions] = useState<TrackOptions>(
    (): TrackOptions => {
      if (typeof window !== 'undefined') {
        let persisted: TrackOptions | undefined
        try {
          persisted = JSON.parse(localStorage.getItem(storageKey) || '')
        } catch (err) {
          console.error(err)
        }
        if (persisted) {
          return {
            ...persisted,
            ...initial,
          }
        }
      }
      return {
        disableTrack: false,
        debug: true,
        documentId: 'abc123',
        ...initial,
        user: {
          id: '1-mike',
          name: 'Mike',
          color: '#ff0000',
          ...initial?.user,
        },
      }
    }
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(options))
    }
  }, [storageKey, options])

  return { options, setOptions }
}

export default useTrackOptions
