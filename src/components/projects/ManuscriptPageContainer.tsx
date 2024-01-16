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

import { ManuscriptToolbar } from '@manuscripts/body-editor'
import {
  CapabilitiesProvider,
  useCalcPermission,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'

import config from '../../config'
import { useCreateEditor } from '../../hooks/use-create-editor'
import { useHandleSnapshot } from '../../hooks/use-handle-snapshot'
import useTrackAttrsPopper from '../../hooks/use-track-attrs-popper'
import useTrackedModelManagement from '../../hooks/use-tracked-model-management'
import { useWindowUnloadEffect } from '../../hooks/use-window-unload-effect'
import { useDoWithThrottle } from '../../postgres-data/savingUtilities'
import { useCommentStore } from '../../quarterback/useCommentStore'
import { useStore } from '../../store'
import AuthorModalViews from '../metadata/AuthorModalViews'
import { Main } from '../Page'
import { useEditorStore } from '../track-changes/useEditorStore'
import { ApplicationMenuContainer, ApplicationMenus } from './ApplicationMenus'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from './EditorContainer'
import EditorElement from './EditorElement'
import Inspector from './Inspector'
import ManuscriptSidebar from './ManuscriptSidebar'
import { TrackChangesStyles } from './TrackChangesStyles'

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
  const [collaboratorsById] = useStore(
    (store) => store.collaboratorsById || new Map()
  )

  const can = usePermissions()

  const handleSnapshot = useHandleSnapshot()

  useEffect(() => {
    storeDispatch({ handleSnapshot })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editor = useCreateEditor()

  const [preventUnload] = useStore((store) => store.preventUnload)
  useWindowUnloadEffect(undefined, preventUnload)

  const { state, dispatch, view } = editor

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

  const { setUsers } = useCommentStore()
  const { init: initEditor, setEditorState, trackState } = useEditorStore()
  useLayoutEffect(
    () => setUsers(collaboratorsById),
    [collaboratorsById, setUsers]
  )
  useLayoutEffect(() => view && initEditor(view), [view, initEditor])

  const hasPendingSuggestions = useMemo(() => {
    const { changeSet } = trackState || {}
    return changeSet && changeSet.pending.length > 0
  }, [trackState])

  useEffect(() => {
    storeDispatch({ hasPendingSuggestions })
  }, [storeDispatch, hasPendingSuggestions])

  useEffect(() => {
    storeDispatch({ editor, view })
  }, [storeDispatch, view]) // eslint-disable-line react-hooks/exhaustive-deps

  const doWithThrottle = useDoWithThrottle()
  useEffect(() => {
    doWithThrottle(() => {
      // @TODO remove zustand editorState store, remove doc from store and only save entire editoreState into the store
      setEditorState(state)
      storeDispatch({ doc: state.doc })
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
                <ApplicationMenuContainer>
                  <ApplicationMenus
                    editor={editor}
                    contentEditable={can.editArticle}
                  />
                </ApplicationMenuContainer>
                {can.seeEditorToolbar && (
                  <ManuscriptToolbar
                    state={state}
                    can={can}
                    dispatch={dispatch}
                    footnotesEnabled={config.features.footnotes}
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

  .edit_authors_button {
    display: initial;
    color: ${(props) => props.theme.colors.button.secondary.color.default};
    background: ${(props) =>
      props.theme.colors.button.secondary.background.default};
    border-color: ${(props) =>
      props.theme.colors.button.secondary.border.default};

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      color: ${(props) => props.theme.colors.button.secondary.color.hover};
      background: ${(props) =>
        props.theme.colors.button.secondary.background.hover};
      border-color: ${(props) =>
        props.theme.colors.button.secondary.border.hover};
    }
  }
`

export default ManuscriptPageContainer
