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

import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import App from './App'
import DatabaseProvider from './components/DatabaseProvider'
import { ModalProvider } from './components/ModalProvider'
import { NotificationProviderWithRouter } from './components/NotificationProvider'
import { ServiceWorker } from './components/ServiceWorker'
import EditorApp from './EditorApp'
import { databaseCreator } from './lib/db'
import { SyncStore } from './sync/SyncStore'
import { GlobalStyle } from './theme/theme'

const Main = () => (
  <DndProvider backend={HTML5Backend}>
    <GlobalStyle />
    {/* <SyncStore> */}
    <NotificationProviderWithRouter>
      <ServiceWorker />
      <ModalProvider>
        <EditorApp
          submissionId="13f64873-a9bf-4d88-a44a-2a25f9e49fc3"
          manuscriptID="MPProject:E1895468-4DFE-4F17-9B06-5212ECD29555"
          projectID="MPManuscript:5F6D807F-CECF-45D0-B94C-5CF1361BDF05"
        />
      </ModalProvider>
    </NotificationProviderWithRouter>
    {/* </SyncStore> */}
  </DndProvider>
)

export default Main
