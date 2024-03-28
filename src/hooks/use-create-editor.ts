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
import { CommentAnnotation } from '@manuscripts/json-schema'
import { getCapabilities as getActionCapabilities } from '@manuscripts/style-guide'
import { buildContribution } from '@manuscripts/transform'
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
      modelMap,
      commitAtLoad,
      fileManagement,
      initialDocVersion,
      style,
      locale,
      authToken,
    },
    dispatch,
    getState,
    subscribe,
  ] = useStore((store) => ({
    doc: store.doc,
    manuscript: store.manuscript,
    project: store.project,
    user: store.user,
    modelMap: store.modelMap,
    commitAtLoad: store.commitAtLoad,
    fileManagement: store.fileManagement,
    initialDocVersion: store.initialDocVersion,
    style: store.cslStyle,
    locale: store.cslLocale,
    authToken: store.authToken,
  }))

  const getCapabilities = memoize((project, user, permittedActions) =>
    getActionCapabilities(project, user, undefined, permittedActions)
  )

  const retrySync = (componentIDs: string[]) => {
    componentIDs.forEach((id) => {
      const model = modelMap.get(id)
      if (!model) {
        return
      }
      getState().saveModel(model)
    })
    return Promise.resolve()
  }

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
<<<<<<< HEAD
    environment: config.environment,
=======
    popper,
>>>>>>> 5cb11bc59bf0f81133bc22aec252a2774e1a4bf7
    history,
    projectID: project._id,

    getManuscript: () => manuscript,
    getCurrentUser: () => user,
    setComment: (comment?: CommentAnnotation) => {
      if (comment) {
        const state = getState()
        const contribution = buildContribution(state.user._id)
        comment.contributions = [contribution]
        dispatch({
          newComments: new Map([...state.newComments, [comment._id, comment]]),
        })
      }
    },
    setSelectedComment: (commentId?: string) =>
      dispatch({ selectedComment: commentId }),
    setEditorSelectedSuggestion: (suggestionId?: string) => {
      dispatch({ editorSelectedSuggestion: suggestionId })
      if (!suggestionId) {
        dispatch({ selectedSuggestion: undefined })
      }
    },
    retrySync,
    subscribeStore: subscribe,

    commit: commitAtLoad || null,
    theme,
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
