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

import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import EditorApp, { EditorAppProps } from './EditorApp'
import { GlobalStyle } from './theme/theme'

const Main: React.FC<EditorAppProps> = ({
  fileManagement,
  files,
  manuscriptID,
  projectID,
  permittedActions,
  getAuthToken,
  observer,
  pluginInspectorTab,
}) => (
  <DndProvider backend={HTML5Backend} context={window}>
    {/* Using context={window} to to access the same DndProvider context, avoiding conflicts when multiple React roots
     try to initialize their own HTML5Backend instances.*/}
    <GlobalStyle />
    <EditorApp
      fileManagement={fileManagement}
      files={files}
      manuscriptID={manuscriptID}
      projectID={projectID}
      permittedActions={permittedActions}
      getAuthToken={getAuthToken}
      observer={observer}
      pluginInspectorTab={pluginInspectorTab}
    />
  </DndProvider>
)

export default Main
