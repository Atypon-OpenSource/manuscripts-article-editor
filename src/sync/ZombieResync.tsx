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

import { RxDatabase } from '@manuscripts/rxdb'
import React, { useEffect } from 'react'
import { Collections } from '../collections'
import zombieCollections from './ZombieCollections'

const RESYNC_RATE = 15 * 1000

interface Props {
  db: RxDatabase<Collections>
}

export const ZombieResync: React.FC<Props> = ({ db }) => {
  useEffect(() => {
    const timer = window.setInterval(() => {
      const zombie = zombieCollections.getOne()
      if (!zombie) return

      // if Promise errors we will just try again next time
      /* tslint:disable-next-line:no-floating-promises */
      zombieCollections.cleanupOne(zombie, db)
    }, RESYNC_RATE)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  return null
}
