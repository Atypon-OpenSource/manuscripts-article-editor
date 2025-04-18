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
import { FileAttachment, FileManagement } from '@manuscripts/body-editor'
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'

import { Api, ApiContext } from './api/Api'
import { ApiSource } from './api/ApiSource'
import { Page } from './components/Page'
import ManuscriptPageContainer from './components/projects/ManuscriptPageContainer'
import { ManuscriptPlaceholder } from './components/projects/ManuscriptPlaceholder'
import { getCurrentUserId } from './lib/user'
import {
  BasicSource,
  createStore,
  GenericStore,
  GenericStoreProvider,
  state,
} from './store'
import { TokenData } from './store/TokenData'

export type AppState = {
  get: () => state | undefined
  update: (state: Partial<state>) => void
}
export type AppStateRef = MutableRefObject<AppState | undefined>

export type AppStateObserver = {
  state: AppStateRef
  onUpdate: (state: state) => void
}

export interface EditorAppProps {
  fileManagement: FileManagement
  files: FileAttachment[]
  manuscriptID: string
  projectID: string
  permittedActions: string[]
  authToken: string
  observer?: AppStateObserver
}

const PlaceholderWrapper = styled.div`
  height: 100%;
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
  authToken,
  observer,
}) => {
  const userID = getCurrentUserId()

  const [store, setStore] = useState<GenericStore>()

  const loadedRef = useRef<boolean>(false)
  const observerSubscribed = useRef<boolean>(false)

  const api = useMemo(() => new Api(authToken), [authToken])

  useEffect(() => {
    // implement remount for the store if component is retriggered
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
      userID: userID || '',
      tokenData: new TokenData(),
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
        <Page>
          <ManuscriptPageContainer />
        </Page>
      </GenericStoreProvider>
    </ApiContext.Provider>
  ) : (
    <PlaceholderWrapper>
      <ManuscriptPlaceholder />
    </PlaceholderWrapper>
  )
}

export default EditorApp
