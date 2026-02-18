/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import { FileAttachment, FileManagement } from '@manuscripts/body-editor'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Api, ApiContext } from './api/Api'
import { ApiSource } from './api/ApiSource'
import { PluginInspectorTab } from './components/projects/Inspector'
import ManuscriptPageContainer from './components/projects/ManuscriptPageContainer'
import { ManuscriptPlaceholder } from './components/projects/ManuscriptPlaceholder'
import { ManuscriptsStateObserver } from './hooks/external/use-manuscripts-state'
import {
  BasicSource,
  createStore,
  GenericStore,
  GenericStoreProvider,
  state,
} from './store'

export interface EditorAppProps {
  fileManagement: FileManagement
  files: FileAttachment[]
  manuscriptID: string
  projectID: string
  permittedActions: string[]
  getAuthToken: () => Promise<string | undefined>
  observer?: ManuscriptsStateObserver
  pluginInspectorTab?: PluginInspectorTab
  isOnHoldSubmission?: boolean
}

const PlaceholderWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1000;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const EditorApp: React.FC<EditorAppProps> = ({
  manuscriptID,
  projectID,
  permittedActions,
  fileManagement,
  files,
  getAuthToken,
  observer,
  pluginInspectorTab,
  isOnHoldSubmission,
}) => {
  const [store, setStore] = useState<GenericStore>()
  const loadedRef = useRef<boolean>(false)
  const observerSubscribed = useRef<boolean>(false)

  const api = useMemo(() => new Api(getAuthToken), [getAuthToken])

  useEffect(() => {
    // implement remount for the store if component is retriggered.
    if (loadedRef.current) {
      return
    }
    loadedRef.current = true
    const props = new BasicSource({
      fileManagement,
      projectID,
      manuscriptID,
      files,
      permittedActions,
      pluginInspectorTab,
      isOnHoldSubmission,
    })
    const apiSource = new ApiSource(api)
    createStore([props, apiSource])
      .then((s) => {
        setStore(s)
      })
      .catch((e) => {
        console.error(e)
      })
    return () => {
      store?.unmount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manuscriptID, projectID])

  useEffect(() => {
    if (!observer || observerSubscribed.current || !store) {
      return
    }
    observerSubscribed.current = true
    store?.subscribe((s) => observer.onUpdate(s))
    observer.state.current = {
      get: () => store?.getState(),
      update: (state) => store?.setState(state as state),
    }
  }, [observer, store])

  return store ? (
    <ApiContext.Provider value={api}>
      <GenericStoreProvider store={store}>
        <ManuscriptPageContainer />
      </GenericStoreProvider>
    </ApiContext.Provider>
  ) : (
    <PlaceholderWrapper>
      <ManuscriptPlaceholder />
    </PlaceholderWrapper>
  )
}

export default EditorApp
