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
  ManuscriptToolbar,
  RequirementsProvider,
} from '@manuscripts/body-editor'
import {
  CapabilitiesProvider,
  useCalcPermission,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'

import config from '../../config'
import { useCreateEditor } from '../../hooks/use-create-editor'
import useTrackedModelManagement from '../../hooks/use-tracked-model-management'
import { useCommentStore } from '../../quarterback/useCommentStore'
import { useStore } from '../../store'
import MetadataContainer from '../metadata/MetadataContainer'
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
  const [project] = useStore((store) => store.project)
  const [user] = useStore((store) => store.user)
  const [modelMap] = useStore((store) => store.modelMap)
  const [_, storeDispatch, getState] = useStore()
  const [doc] = useStore((store) => store.doc)
  const [saveModel] = useStore((store) => store.saveModel)
  const [deleteModel] = useStore((store) => store.deleteModel)
  const [collaboratorsById] = useStore(
    (store) => store.collaboratorsById || new Map()
  )

  const can = usePermissions()

  const editor = useCreateEditor()

  const { state, dispatch, view } = editor

  const { saveTrackModel, trackModelMap, deleteTrackModel, getTrackModel } =
    useTrackedModelManagement(
      doc,
      view,
      state,
      dispatch,
      saveModel,
      deleteModel,
      modelMap,
      () => getState().attachments
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

  setEditorState(state) // not sure if that's needed. Needs a check

  return (
    <RequirementsProvider modelMap={modelMap}>
      <ManuscriptSidebar
        project={project}
        manuscript={manuscript}
        view={view}
        state={state}
        user={user}
      />

      <PageWrapper>
        <Main>
          <EditorContainer>
            <EditorContainerInner>
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
                <MetadataContainer
                  handleTitleStateChange={() => '' /*FIX THIS*/}
                  allowInvitingAuthors={false}
                  showAuthorEditButton={true}
                  disableEditButton={!can.editMetadata}
                />
                <TrackChangesStyles>
                  <EditorElement editor={editor} />
                </TrackChangesStyles>
              </EditorBody>
            </EditorContainerInner>
          </EditorContainer>
        </Main>
        <Inspector editor={editor} />
      </PageWrapper>
    </RequirementsProvider>
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
