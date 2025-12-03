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

import './lib/fonts'

import React, { Suspense } from 'react'

import { LoadingPage } from './components/Loading'
import { ManuscriptsEditorConfig, setConfig } from './config'
import { EditorAppProps } from './EditorApp'
export type { EditorAppProps } from './EditorApp'
import Main from './Main'
import { ThemeProvider } from './theme/ThemeProvider'
export { detectInconsistencyPluginKey } from '@manuscripts/body-editor'
export { ProjectRole } from './lib/roles'
export type { state } from './store'
export { getUserRole } from './lib/roles'
export * from './hooks/external/use-manuscripts-state'
export type { ManuscriptsEditorConfig } from './config'
export {
  InspectorPanel,
  InspectorAction,
} from './hooks/use-inspector-tabs-context'

const ManuscriptEditor: React.FC<
  EditorAppProps & { config: ManuscriptsEditorConfig }
> = ({
  fileManagement,
  files,
  manuscriptID,
  projectID,
  permittedActions,
  getAuthToken,
  config,
  observer,
  pluginInspectorTab,
}) => {
  setConfig(config)
  return (
    <>
      <ThemeProvider>
        <Suspense
          fallback={<LoadingPage className={'loader'}>Loading...</LoadingPage>}
        >
          <Main
            fileManagement={fileManagement}
            files={files}
            manuscriptID={manuscriptID}
            projectID={projectID}
            permittedActions={permittedActions}
            getAuthToken={getAuthToken}
            observer={observer}
            pluginInspectorTab={pluginInspectorTab}
          />
        </Suspense>
      </ThemeProvider>
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
