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
import {
  ManuscriptsEditor,
  PopperManager,
  useEditor,
} from '@manuscripts/body-editor'
import { CommentAnnotation, Model } from '@manuscripts/json-schema'
import { getCapabilities as getActionCapabilities } from '@manuscripts/style-guide'
import { trackChangesPlugin } from '@manuscripts/track-changes-plugin'
import { Build, buildContribution } from '@manuscripts/transform'
import { memoize } from 'lodash'
import React, { ReactChild, ReactNode, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useHistory } from 'react-router'

import CitationEditor from '../components/library/CitationEditor'
import { CitationViewer } from '../components/library/CitationViewer'
import { ReferencesEditor } from '../components/library/ReferencesEditor'
import { ReferencesViewer } from '../components/library/ReferencesViewer'
import config from '../config'
import { useAuthStore } from '../quarterback/useAuthStore'
import { useStore } from '../store'
import { theme } from '../theme/theme'
import { ThemeProvider } from '../theme/ThemeProvider'

export const useCreateEditor = () => {
  const [
    {
      doc,
      ancestorDoc,
      manuscript,
      project,
      user,
      modelMap,
      biblio,
      commitAtLoad,
      fileManagement,
      style,
      locale,
    },
    dispatch,
    getState,
  ] = useStore((store) => ({
    doc: store.doc,
    ancestorDoc: store.ancestorDoc,
    manuscript: store.manuscript,
    project: store.project,
    user: store.user,
    modelMap: store.modelMap,
    biblio: store.biblio,
    commitAtLoad: store.commitAtLoad,
    fileManagement: store.fileManagement,
    style: store.cslStyle,
    locale: store.cslLocale,
  }))
  const { user: trackUser } = useAuthStore()

  const getCapabilities = memoize((project, user, permittedActions) =>
    getActionCapabilities(project, user, undefined, permittedActions)
  )

  const popper = useRef<PopperManager>(new PopperManager())

  const getModelMap = () => {
    return getState().modelMap
  }

  const saveModel = <T extends Model>(model: T | Build<T> | Partial<T>) => {
    /*
    Models plugin in the prosemirror-editor calls saveModel when there is a change on a model (aux objects, citations, references),
    but only if requested in a transaction so it happens only in a couple of cases.
    This shouldn't be happening with the track-changes enabled. With the way things are currently,
    we might need to implement filtering to avoid updates on the models that are trackable with track-changes.
    Once metadata are trackable saveModel (for final modelMap) shouldn't be available to the editor at all.
    */
    return getState().saveModel(model)
  }

  const deleteModel = (id: string) => {
    return getState().deleteModel(id)
  }

  const retrySync = (componentIDs: string[]) => {
    componentIDs.forEach((id) => {
      const model = modelMap.get(id)
      if (!model) {
        return
      }
      saveModel(model)
    })
    return Promise.resolve()
  }

  const history = useHistory()

  const editorProps = {
    attributes: {
      class: 'manuscript-editor',
      lang: 'en-GB',
      spellcheck: 'true',
      tabindex: '2',
    },
    doc,
    plugins: config.quarterback.enabled
      ? [
          trackChangesPlugin({
            userID: trackUser.id,
            debug: config.environment === 'development',
          }),
        ]
      : [],
    locale: manuscript?.primaryLanguageCode || 'en-GB',
    cslProps: {
      style,
      locale,
    },
    environment: config.environment,
    history,
    popper: popper.current,
    projectID: project._id,

    // refactor the library stuff to a hook-ish type thingy
    ...biblio,

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
    getModelMap,
    saveModel,
    deleteModel,
    retrySync,

    renderReactComponent: (child: ReactNode, container: HTMLElement) => {
      if (child && typeof child !== 'boolean') {
        ReactDOM.render(
          <ThemeProvider>{child as ReactChild}</ThemeProvider>,
          container
        )
      }
    },
    unmountReactComponent: ReactDOM.unmountComponentAtNode,
    components: {
      ReferencesEditor,
      ReferencesViewer,
      CitationEditor,
      CitationViewer,
    },

    ancestorDoc: ancestorDoc,
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
  }

  const editor = useEditor(
    ManuscriptsEditor.createState(editorProps),
    ManuscriptsEditor.createView(editorProps)
  )
  return editor
}
