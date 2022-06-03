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

import './lib/analytics'
import './lib/fonts'
import './channels'

import AppIcon from '@manuscripts/assets/react/AppIcon'
import decode from 'jwt-decode'
import React, { useEffect } from 'react'

import { IntlProvider } from './components/IntlHookableProvider'
import { LoadingPage } from './components/Loading'
import tokenHandler from './lib/token'
import { TokenPayload } from './lib/user'
import userID from './lib/user-id'
import Main from './Main'
import { ThemeProvider } from './theme/ThemeProvider'

export interface ManuscriptEditorAppProps {
  submissionId: string
  authToken?: string
}

export const ManuscriptEditorApp: React.FC<ManuscriptEditorAppProps> = ({
  submissionId,
  authToken,
}) => {
  useEffect(() => {
    if (authToken) {
      tokenHandler.remove()
      tokenHandler.set(authToken) // @TODO actually relogin whe the token changes
      const { userId } = decode<TokenPayload>(authToken)

      if (!userId) {
        throw new Error('Invalid token')
      }

      userID.set(userId)
    }
    return () => {
      tokenHandler.remove()
      userID.remove()
    }
  }, [authToken])

  return (
    <>
      <IntlProvider>
        <ThemeProvider>
          <React.Suspense
            fallback={
              <LoadingPage className={'loader'}>
                <AppIcon />
              </LoadingPage>
            }
          >
            <Main
              // userID={userID}
              submissionId={submissionId}
            />
          </React.Suspense>
        </ThemeProvider>
      </IntlProvider>
      <div id="menu"></div>
      <div id="notifications"></div>
      <div id="size"></div>
    </>
  )
}
