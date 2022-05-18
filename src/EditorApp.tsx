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
import React, { useEffect, useState } from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'
import styled from 'styled-components'

import { NotificationProvider } from './components/NotificationProvider'
import { Page } from './components/Page'
import { ProjectPlaceholder } from './components/Placeholders'
import ManuscriptPageContainer from './components/projects/lean-workflow/ManuscriptPageContainerLW'
import CouchSource from './couch-data/CouchSource'
import { getCurrentUserId } from './lib/user'
import {
  BasicSource,
  createStore,
  GenericStore,
  GenericStoreProvider,
} from './store'

interface Props {
  submissionId: string
  manuscriptID: string
  projectID: string
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
  submissionId,
  manuscriptID,
  projectID,
  authToken,
}) => {
  const userID = getCurrentUserId()
  const [store, setStore] = useState<GenericStore>()

  useEffect(() => {
    // implement remount for the store if component is retriggered
    const basicSource = new BasicSource(
      submissionId,
      projectID,
      manuscriptID,
      userID || '',
      authToken
    )
    const couchSource = new CouchSource()
    createStore([basicSource, couchSource])
      .then((store) => {
        setStore(store)
      })
      .catch((e) => {
        console.log(e)
      })
    return () => store?.unmount()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, manuscriptID, projectID])

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
    <ProjectPlaceholder />
  )
}

export default hot(module)(EditorApp)
