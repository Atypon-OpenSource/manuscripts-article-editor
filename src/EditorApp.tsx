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
import { schema } from '@manuscripts/manuscript-transform'
import { FileManagement } from '@manuscripts/style-guide'
import React, { useEffect, useMemo, useState } from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'
import styled from 'styled-components'

import { ModalProvider } from './components/ModalHookableProvider'
import { NotificationProvider } from './components/NotificationProvider'
import { Page } from './components/Page'
import { ProjectPlaceholder } from './components/Placeholders'
import ManuscriptPageContainer from './components/projects/lean-workflow/ManuscriptPageContainerLW'
import config from './config'
import CouchSource from './couch-data/CouchSource'
import { Person, Submission } from './lib/lean-workflow-gql'
import { getCurrentUserId } from './lib/user'
import PsSource from './postgres-data/PsSource'
import { useAuthStore } from './quarterback/useAuthStore'
import { useDocStore } from './quarterback/useDocStore'
import { usePouchStore } from './quarterback/usePouchStore'
import { useSnapshotStore } from './quarterback/useSnapshotStore'
import {
  BasicSource,
  createStore,
  GenericStore,
  GenericStoreProvider,
} from './store'
import { ISubject } from './store/StoreObserver'

interface Props {
  fileManagement: FileManagement
  storeObserver: ISubject
  submissionId: string
  manuscriptID: string
  projectID: string
  submission: Submission
  person: Person
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
  storeObserver,
  submissionId,
  manuscriptID,
  projectID,
  submission,
  fileManagement,
  person,
  authToken,
}) => {
  const userID = getCurrentUserId()

  const [store, setStore] = useState<GenericStore>()
  const { authenticate, setUser } = useAuthStore()
  const { createDocument, getDocument, setCurrentDocument } = useDocStore()
  const { init: initPouchStore } = usePouchStore()
  const { init: initSnapshots, setSnapshots } = useSnapshotStore()
  useMemo(() => {
    const user = store?.state?.user
    if (user) {
      setUser(user._id, user.bibliographicName.given || user.userID)
    } else {
      setUser('none', 'Anonymous')
    }
  }, [store?.state?.user, setUser])

  useEffect(() => {
    // implement remount for the store if component is retriggered
    const basicSource = new BasicSource(
      submissionId,
      fileManagement,
      projectID,
      manuscriptID,
      submission,
      person,
      userID || '',
      authToken || ''
    )
    const mainSource = config.rxdb.enabled ? new CouchSource() : new PsSource()
    Promise.all([
      loadDoc(manuscriptID, projectID),
      createStore([basicSource, mainSource]),
    ])
      .then(([doc, store]) => {
        if (doc) {
          store.setState((s) => ({ ...s, doc }))
        }
        initPouchStore({
          getModels: () => store.state?.modelMap,
          saveModel: store.state?.saveModel,
        })
        setStore(store)
      })
      .catch((e) => {
        console.error(e)
      })
    return () => store?.unmount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, manuscriptID, projectID])

  useEffect(() => {
    if (store && storeObserver) {
      storeObserver.attach((state) => {
        if (store.state) {
          store.setState({ ...store.state, ...state })
        }
      })
    }
  }, [store, storeObserver])

  async function loadDoc(manuscriptID: string, projectID: string) {
    if (!config.quarterback.enabled) {
      return undefined
    }
    const auth = await authenticate()
    if (!auth) {
      return undefined
    }
    setCurrentDocument(manuscriptID, projectID)
    const found = await getDocument(manuscriptID)
    let doc
    if ('data' in found) {
      initSnapshots()
      setSnapshots(found.data.snapshots)
      doc = found.data.doc
    } else if ('err' in found && found.code === 404) {
      // Create an empty doc that will be replaced with whatever document is currently being edited
      createDocument(manuscriptID, projectID)
    }
    if (
      doc !== null &&
      typeof doc === 'object' &&
      Object.keys(doc).length !== 0
    ) {
      return schema.nodeFromJSON(doc)
    }
    return undefined
  }

  return store ? (
    <GenericStoreProvider store={store}>
      <ModalProvider>
        <Router>
          <NotificationProvider>
            <Page>
              <Wrapper>
                <ManuscriptPageContainer />
              </Wrapper>
            </Page>
          </NotificationProvider>
        </Router>
      </ModalProvider>
    </GenericStoreProvider>
  ) : (
    <ProjectPlaceholder />
  )
}

export default hot(module)(EditorApp)
