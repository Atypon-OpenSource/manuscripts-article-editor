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

import { ApolloProvider } from '@apollo/react-hooks'
import React, { useEffect, useMemo, useState } from 'react'
import { hot } from 'react-hot-loader'

import { apolloClient } from './lib/apollo'

import {
  GenericStoreProvider,
  createStore,
  BasicSource,
  GenericStore,
} from './store'
import CouchSource from './couch-data/CouchSource'
import { getCurrentUserId } from './lib/user'
import OnlyEditor, { TestComponent } from './OnlyEditor'
import { Loading } from './components/Loading'

interface Props {
  submissionId: string
  manuscriptID: string
  projectID: string
}

const EditorApp: React.FC<Props> = ({
  submissionId,
  manuscriptID,
  projectID,
}) => {
  const userID = getCurrentUserId()

  const [store, setStore] = useState<GenericStore>()
  useEffect(() => {
    // implement remount for the store if component is retriggered
    if (store) {
      store.unmount()
    }
    const basicSource = new BasicSource(
      submissionId,
      manuscriptID,
      projectID,
      userID
    )
    const couchSource = new CouchSource()
    // const lwSource = new LeanGQLData()
    createStore([basicSource, couchSource])
      .then((store) => {
        setStore(store)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [submissionId, manuscriptID, projectID])

  return store ? (
    <GenericStoreProvider store={store}>
      <ApolloProvider client={apolloClient}>
        {/* <OnlyEditor /> */}
        <TestComponent />
      </ApolloProvider>
    </GenericStoreProvider>
  ) : (
    <Loading>Loading store...</Loading>
  )
}

export default hot(module)(EditorApp)
