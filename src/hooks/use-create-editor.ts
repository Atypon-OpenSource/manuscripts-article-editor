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
import { useEditor } from '@manuscripts/body-editor'
import { getCapabilities as getActionCapabilities } from '@manuscripts/style-guide'
import { memoize } from 'lodash'
import { useHistory } from 'react-router'

import config from '../config'
import { stepsExchanger } from '../quarterback/QuarterbackStepsExchanger'
import { useStore } from '../store'
import { theme } from '../theme/theme'

export const useCreateEditor = () => {
  const [
    {
      doc,
      manuscript,
      project,
      user,
      fileManagement,
      initialDocVersion,
      style,
      locale,
      authToken,
    },
    dispatch,
    getState,
  ] = useStore((store) => ({
    doc: store.doc,
    manuscript: store.manuscript,
    project: store.project,
    user: store.user,
    fileManagement: store.fileManagement,
    initialDocVersion: store.initialDocVersion,
    style: store.cslStyle,
    locale: store.cslLocale,
    authToken: store.authToken,
  }))

  const getCapabilities = memoize((project, user, permittedActions) =>
    getActionCapabilities(project, user, undefined, permittedActions)
  )

  const history = useHistory()

  const props = {
    attributes: {
      class: 'manuscript-editor',
      lang: 'en-GB',
      spellcheck: 'true',
      tabindex: '2',
    },
    doc,
    userID: user._id,
    debug: config.environment === 'development',
    locale: manuscript?.primaryLanguageCode || 'en-GB',
    cslProps: {
      style,
      locale,
    },
    theme,
    history,
    projectID: project._id,

    getManuscript: () => manuscript,
    getCurrentUser: () => user,
    getCapabilities: () => {
      const state = getState()
      return getCapabilities(state.project, state.user, state.permittedActions)
    },
    getFiles: () => {
      return getState().files
    },
    fileManagement: fileManagement,
    collabProvider: stepsExchanger(
      manuscript._id,
      project._id,
      initialDocVersion,
      authToken,
      (preventUnload, beforeUnload) => {
        if (beforeUnload !== undefined) {
          dispatch({ preventUnload, beforeUnload })
        } else {
          dispatch({ preventUnload })
        }
      }
    ),
  }

  const editor = useEditor(props)
  return editor
}
