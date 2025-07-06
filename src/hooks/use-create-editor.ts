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
import { useEditor } from '@manuscripts/body-editor'
import { Project, UserProfile } from '@manuscripts/json-schema'
import { getCapabilities as getActionCapabilities } from '@manuscripts/style-guide'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { useApi } from '../api/Api'
import { StepsExchanger } from '../api/StepsExchanger'
import { getConfig } from '../config'
import { useStore } from '../store'
import { theme } from '../theme/theme'
import { useCompareDocuments } from './use-compare-documents'
import { useInspectorTabsContext } from './use-inspector-tabs-context'

export const useCreateEditor = () => {
  const [
    {
      doc,
      initialDocVersion,
      projectID,
      manuscriptID,
      user,
      fileManagement,
      style,
      locale,
      sectionCategories,
      isViewingMode,
      getSnapshot,
    },
    dispatch,
    getState,
  ] = useStore((store) => ({
    doc: store.doc,
    initialDocVersion: store.initialDocVersion,
    projectID: store.projectID,
    manuscriptID: store.manuscriptID,
    user: store.user,
    fileManagement: store.fileManagement,
    style: store.cslStyle,
    locale: store.cslLocale,
    sectionCategories: store.sectionCategories,
    isViewingMode: store.isViewingMode,
    getSnapshot: store.getSnapshot,
  }))

  const api = useApi()
  const [searchParams] = useSearchParams()

  const { comparedDoc, isComparingMode } = useCompareDocuments({
    originalId: searchParams.get('originalId') || undefined,
    comparisonId: searchParams.get('comparisonId') || undefined,
    getSnapshot,
  })

  useEffect(() => {
    dispatch({ isComparingMode })
  }, [isComparingMode, dispatch])

  const updateVersion = (v: number) => dispatch({ initialDocVersion: v })

  const stepsExchanger = useMemo(
    () =>
      isComparingMode
        ? undefined
        : new StepsExchanger(
            projectID,
            manuscriptID,
            initialDocVersion,
            api,
            updateVersion
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectID, manuscriptID, api, isComparingMode]
  )

  useEffect(() => {
    if (stepsExchanger) {
      stepsExchanger.isThrottling.onChange((value: boolean) => {
        dispatch({
          preventUnload: value,
        })
      })
      dispatch({
        beforeUnload: () => stepsExchanger.flush(),
      })
      return () => stepsExchanger.stop()
    }
  }, [dispatch, stepsExchanger])

  const getCapabilities = useMemo(
    () => (project: Project, user: UserProfile, permittedActions: string[]) =>
      getActionCapabilities(
        project,
        user,
        undefined,
        permittedActions,
        isViewingMode
      ),
    [isViewingMode]
  )
  const config = getConfig()
  const onEditorClick = useInspectorTabsContext()

  const props = {
    attributes: {
      class: 'manuscript-editor',
      lang: 'en-GB',
      spellcheck: 'true',
      tabindex: '2',
    },
    doc: comparedDoc || doc, // Use compared document if in comparison mode
    userID: user._id,
    debug: config.environment === 'development',
    // @TODO - move primaryLanguageCode to be an attribute on ManuscriptNode
    locale: 'en-GB',
    cslProps: {
      style,
      locale,
    },
    theme,
    projectID: projectID,
    onEditorClick,
    getCurrentUser: () => user,
    getCapabilities: () => {
      const state = getState()
      return getCapabilities(state.project, state.user, state.permittedActions)
    },
    getFiles: () => {
      return getState().files
    },
    fileManagement: fileManagement,
    collabProvider: isComparingMode ? undefined : stepsExchanger, // Disable collaboration in comparison mode
    sectionCategories: sectionCategories,
    navigate: useNavigate(),
    location: useLocation(),
    isComparingMode,
    lockBody: config.features.lockBody,
    isViewingMode,
  }
  const editor = useEditor(props)
  return editor
}
