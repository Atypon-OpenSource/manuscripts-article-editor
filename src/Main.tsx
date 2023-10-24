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
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { ServiceWorker } from './components/ServiceWorker'
import EditorApp from './EditorApp'
import { ISubject } from './store/ParentObserver'
import { GlobalStyle } from './theme/theme'

interface Props {
  fileManagement: FileManagement
  files: FileAttachment[]
  parentObserver: ISubject
  manuscriptID: string
  projectID: string
  authToken: string
  permittedActions: string[]
}

// projectID="MPProject:E1895468-4DFE-4F17-9B06-5212ECD29555"
// manuscriptID="MPManuscript:5F6D807F-CECF-45D0-B94C-5CF1361BDF05"

const Main: React.FC<Props> = ({
  fileManagement,
  files,
  parentObserver,
  manuscriptID,
  projectID,
  authToken,
  permittedActions,
}) => (
  <DndProvider backend={HTML5Backend}>
    <GlobalStyle />
    <ServiceWorker />
    <EditorApp
      fileManagement={fileManagement}
      files={files}
      parentObserver={parentObserver}
      manuscriptID={manuscriptID}
      projectID={projectID}
      permittedActions={permittedActions}
      authToken={authToken}
    />
  </DndProvider>
)

export default Main
