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

import '@manuscripts/body-editor/styles/Editor.css'
import '@manuscripts/body-editor/styles/AdvancedEditor.css'
import '@manuscripts/body-editor/styles/popper.css'
import '@reach/tabs/styles.css'

import {
  CapabilitiesProvider,
  useCalcPermission,
  usePermissions,
} from '@manuscripts/style-guide'
import { trackChangesPluginKey } from '@manuscripts/track-changes-plugin'
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'

import { useCreateEditor } from '../../hooks/use-create-editor'
import { useHandleSnapshot } from '../../hooks/use-handle-snapshot'
import useTrackAttrsPopper from '../../hooks/use-track-attrs-popper'
import { useWindowUnloadEffect } from '../../hooks/use-window-unload-effect'
import { useDoWithThrottle } from '../../postgres-data/savingUtilities'
import { useStore } from '../../store'
import useTrackedModelManagement from '../../tracked-models/use-tracked-model-management'
import AuthorModalViews from '../metadata/AuthorModalViews'
import { Main } from '../Page'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from './EditorContainer'
import EditorElement from './EditorElement'
import Inspector from './Inspector'
import { ManuscriptMenus } from './ManuscriptMenus'
import ManuscriptSidebar from './ManuscriptSidebar'
import { ManuscriptToolbar } from './ManuscriptToolbar'
import { TrackChangesStyles } from './TrackChangesStyles'

export const ManuscriptMenusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ManuscriptPageContainer: React.FC = () => {
  const [{ project, user, permittedActions }] = useStore((state) => {
    return {
      project: state.project,
      user: state.user,
      permittedActions: state.permittedActions,
      authToken: state.authToken,
    }
  })

  const can = useCalcPermission({
    profile: user,
    project: project,
    permittedActions,
  })

  return (
    <CapabilitiesProvider can={can}>
      <ManuscriptPageView />
    </CapabilitiesProvider>
  )
}

const ManuscriptPageView: React.FC = () => {
  const [manuscript] = useStore((store) => store.manuscript)
  const [modelMap] = useStore((store) => store.modelMap)
  const [_, storeDispatch] = useStore((store) => store.manuscriptID)
  const [doc] = useStore((store) => store.doc)
  const [saveModel] = useStore((store) => store.saveModel)
  const [deleteModel] = useStore((store) => store.deleteModel)

  const can = usePermissions()

  const editor = useCreateEditor()

  const [preventUnload] = useStore((store) => store.preventUnload)
  useWindowUnloadEffect(undefined, preventUnload)

  const { state, dispatch, view } = editor

  const handleSnapshot = useHandleSnapshot(view)

  useEffect(() => {
    storeDispatch({ handleSnapshot })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view?.state])

  useLayoutEffect(() => {
    const trackState = trackChangesPluginKey.getState(state)
    if (trackState) {
      // set init tracking state
      storeDispatch({ trackState })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { saveTrackModel, trackModelMap, deleteTrackModel, getTrackModel } =
    useTrackedModelManagement(
      doc,
      view,
      state,
      dispatch,
      saveModel,
      deleteModel,
      modelMap
    )

  useEffect(() => {
    storeDispatch({
      saveTrackModel,
      trackModelMap,
      deleteTrackModel,
      getTrackModel,
    })
  }, [
    saveTrackModel,
    trackModelMap,
    deleteTrackModel,
    storeDispatch,
    getTrackModel,
  ])

  const hasPendingSuggestions = useMemo(() => {
    const { changeSet } = trackChangesPluginKey.getState(state) || {}
    return changeSet && changeSet.pending.length > 0
  }, [state])

  useEffect(() => {
    storeDispatch({ hasPendingSuggestions })
  }, [storeDispatch, hasPendingSuggestions])

  useEffect(() => {
    storeDispatch({ editor, view })
  }, [storeDispatch, view]) // eslint-disable-line react-hooks/exhaustive-deps

  const doWithThrottle = useDoWithThrottle()
  useEffect(() => {
    const trackState = trackChangesPluginKey.getState(state)

    doWithThrottle(() => {
      storeDispatch({ doc: state.doc, trackState, view })
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const trackAttrsPopper = useTrackAttrsPopper()

  const onAppClick = useCallback(
    (e: React.MouseEvent) => {
      // TODO:: handle dropdown list for figure and file inspector
      trackAttrsPopper(e)
    },
    [trackAttrsPopper]
  )

  return (
    <>
      <ManuscriptSidebar
        data-cy="manuscript-sidebar"
        manuscript={manuscript}
        view={view}
        state={state}
      />

      <PageWrapper onClick={onAppClick}>
        <Main data-cy="editor-main">
          <EditorContainer>
            <EditorContainerInner>
              <AuthorModalViews />
              <EditorHeader>
                <ManuscriptMenusContainer>
                  <ManuscriptMenus editor={editor} />
                </ManuscriptMenusContainer>
                {can.seeEditorToolbar && (
                  <ManuscriptToolbar
                    state={state}
                    dispatch={dispatch}
                    view={view}
                  />
                )}
              </EditorHeader>
              <EditorBody>
                <TrackChangesStyles>
                  <EditorElement editor={editor} />
                </TrackChangesStyles>
              </EditorBody>
            </EditorContainerInner>
          </EditorContainer>
        </Main>
        <Inspector data-cy="inspector" editor={editor} />
      </PageWrapper>
    </>
  )
}

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 2;
  overflow: hidden;
`

export default ManuscriptPageContainer
