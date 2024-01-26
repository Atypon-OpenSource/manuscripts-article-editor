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
import { FileAttachment, FileManagement } from '@manuscripts/style-guide'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled from 'styled-components'

import { ManuscriptPlaceholder } from './components/ManuscriptPlaceholder'
import { NotificationProvider } from './components/NotificationProvider'
import { Page } from './components/Page'
import ManuscriptPageContainer from './components/projects/ManuscriptPageContainer'
import { getCurrentUserId } from './lib/user'
import PsSource from './postgres-data/PsSource'
import QuarterbackDataSource from './quarterback/QuarterBackDataSource'
import { useLoadDoc } from './quarterback/useLoadDoc'
import {
  BasicSource,
  createStore,
  GenericStore,
  GenericStoreProvider,
} from './store'
import { ISubject } from './store/ParentObserver'

interface Props {
  fileManagement: FileManagement
  files: FileAttachment[]
  parentObserver: ISubject
  manuscriptID: string
  projectID: string
  permittedActions: string[]
  authToken: string
}

const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  color: rgb(53, 53, 53);
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Lato, sans-serif;
`

const EditorApp: React.FC<Props> = ({
  parentObserver,
  manuscriptID,
  projectID,
  permittedActions,
  fileManagement,
  files,
  authToken,
}) => {
  const userID = getCurrentUserId()

  const [store, setStore] = useState<GenericStore>()

  const loadDoc = useLoadDoc(authToken)
  const quarterBackSource = new QuarterbackDataSource(loadDoc)

  useEffect(() => {
    // implement remount for the store if component is retriggered
    const basicSource = new BasicSource(
      fileManagement,
      projectID,
      manuscriptID,
      files,
      permittedActions,
      userID || '',
      authToken || ''
    )
    const mainSource = new PsSource(files)
    createStore(
      [basicSource, mainSource, quarterBackSource],
      undefined,
      undefined,
      parentObserver
    )
      .then((store) => {
        setStore(store)
      })
      .catch((e) => {
        console.error(e)
      })
    return () => {
      parentObserver?.detach()
      store?.unmount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manuscriptID, projectID])

  return store ? (
    <GenericStoreProvider store={store}>
      <Router>
        <NotificationProvider>
          <Page>
            <Wrapper>
              <ManuscriptPageContainer />
            </Wrapper>
          </Page>
        </NotificationProvider>
      </Router>
    </GenericStoreProvider>
  ) : (
    <ManuscriptPlaceholder />
  )
}

export default EditorApp
