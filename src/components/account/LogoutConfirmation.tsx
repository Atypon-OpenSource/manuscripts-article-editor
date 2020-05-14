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
import { Category, Dialog } from '@manuscripts/style-guide'
import React, { useCallback, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Collections } from '../../collections'
import CollectionManager from '../../sync/CollectionManager'
import zombieCollections from '../../sync/ZombieCollections'
import { ContactSupportButton } from '../ContactSupportButton'

type ConfirmationStage = 'ready' | 'checking' | 'unsynced' | 'gaveup'

export const LogoutConfirmationContext = React.createContext<
  (event: React.SyntheticEvent) => void
>(() => null)

const headers = {
  checking: 'You may have unsynced changes',
  unsynced: 'You have unsynced changes',
  gaveup: 'Unable to sync your changes',
}

interface Props {
  db: RxDatabase<Collections>
}

const LogoutConfirmationComponent: React.FC<RouteComponentProps & Props> = ({
  children,
  history,
  db,
}) => {
  const [confirmationStage, setConfirmationStage] = useState<ConfirmationStage>(
    'ready'
  )

  const checkAndTryResync = async (retries = 0): Promise<undefined> => {
    if (retries > 1) {
      setConfirmationStage('gaveup')
      return
    }

    const unsyncedCollections = await CollectionManager.unsyncedCollections()

    if (!unsyncedCollections.length && !zombieCollections.getOne()) {
      history.push('/logout')
      return
    }

    setConfirmationStage('unsynced')

    await CollectionManager.pushCollections(unsyncedCollections)
    await zombieCollections.cleanupAll(db)

    return checkAndTryResync(retries + 1)
  }

  const handleLogout = useCallback((event: React.SyntheticEvent) => {
    event.preventDefault()

    checkAndTryResync().catch(() => setConfirmationStage('gaveup'))
  }, [])

  const message = (() => {
    switch (confirmationStage) {
      case 'gaveup':
        return (
          <div>
            <span>If you sign out, your changes will be lost.</span>
            <ContactSupportButton>Chat with support.</ContactSupportButton>
          </div>
        )

      case 'unsynced':
        return 'Attempting to sync…'

      case 'checking':
        return 'Checking…'
    }

    return ''
  })()

  return (
    <LogoutConfirmationContext.Provider value={handleLogout}>
      {confirmationStage !== 'ready' && (
        <Dialog
          isOpen={true}
          message={message}
          actions={{
            primary: {
              action: () => history.push('/logout'),
              title: 'Sign out now',
            },
            secondary: {
              action: () => setConfirmationStage('ready'),
              title: 'Cancel',
            },
          }}
          category={Category.error}
          header={headers[confirmationStage]}
        />
      )}

      {children}
    </LogoutConfirmationContext.Provider>
  )
}

export const LogoutConfirmation = withRouter(LogoutConfirmationComponent)
