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
import { FileManagement } from '@manuscripts/style-guide'
import decode from 'jwt-decode'
import React, { useEffect } from 'react'

import { IntlProvider } from './components/IntlHookableProvider'
import { LoadingPage } from './components/Loading'
import { Person, Submission } from './lib/lean-workflow-gql'
import tokenHandler from './lib/token'
import { TokenPayload } from './lib/user'
import userID from './lib/user-id'
import Main from './Main'
import { ISubject } from './store/ParentObserver'
import { ThemeProvider } from './theme/ThemeProvider'

export { ProjectRole } from './lib/roles'
export type { state } from './store'
export * from './store/ParentObserver'
export { SaveStatusController } from './components/projects/lean-workflow/SaveStatusController'
export { ExceptionDialog } from './components/projects/lean-workflow/ExceptionDialog'

export interface ManuscriptEditorAppProps {
  fileManagement: FileManagement
  parentObserver: ISubject
  submissionId: string
  manuscriptID: string
  projectID: string
  submission: Submission
  permittedActions: string[]
  person: Person
  authToken?: string
}

const ManuscriptEditor: React.FC<ManuscriptEditorAppProps> = ({
  fileManagement,
  parentObserver,
  submissionId,
  manuscriptID,
  projectID,
  submission,
  permittedActions,
  person,
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
              fileManagement={fileManagement}
              authToken={authToken || ''}
              parentObserver={parentObserver}
              submissionId={submissionId}
              manuscriptID={manuscriptID}
              projectID={projectID}
              submission={submission}
              permittedActions={permittedActions}
              person={person}
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

export const ManuscriptEditorApp = React.memo(
  ManuscriptEditor,
  (prev, next) => {
    // Due to complexity of this component rerendering it idly would be a major inconvenience and a performance problem
    // To update that component from above we introduced the parentObserver that allowes to manipulate the state in a controlled manner
    return prev.manuscriptID == next.manuscriptID // if props are equal, do not rerender
  }
)
