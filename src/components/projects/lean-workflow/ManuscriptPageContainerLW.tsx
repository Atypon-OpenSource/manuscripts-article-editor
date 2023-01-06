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

import '@manuscripts/manuscript-editor/styles/Editor.css'
import '@manuscripts/manuscript-editor/styles/LeanWorkflow.css'
import '@manuscripts/manuscript-editor/styles/track-styles.css'
import '@manuscripts/manuscript-editor/styles/popper.css'
import '@reach/tabs/styles.css'

import { ApolloError } from '@apollo/client'
import {
  ManuscriptToolbar,
  RequirementsProvider,
} from '@manuscripts/manuscript-editor'
import { ManuscriptEditorState } from '@manuscripts/manuscript-transform'
import {
  CapabilitiesProvider,
  useCalcPermission,
  usePermissions,
} from '@manuscripts/style-guide'
import { TrackChangesStatus } from '@manuscripts/track-changes-plugin'
import { debounce } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import config from '../../../config'
import { useCreateEditor } from '../../../hooks/use-create-editor'
import useTrackedModelManagement from '../../../hooks/use-tracked-model-management'
import {
  graphQLErrorMessage,
  Person,
  useGetPermittedActions,
} from '../../../lib/lean-workflow-gql'
import { useCommentStore } from '../../../quarterback/useCommentStore'
import { useDocStore } from '../../../quarterback/useDocStore'
import { useStore } from '../../../store'
import MetadataContainer from '../../metadata/MetadataContainer'
import { Main } from '../../Page'
import { ManuscriptPlaceholder } from '../../Placeholders'
import { useEditorStore } from '../../track-changes/useEditorStore'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from '../EditorContainer'
import ManuscriptSidebar from '../ManuscriptSidebar'
import { ReloadDialog } from '../ReloadDialog'
import {
  ApplicationMenuContainer,
  ApplicationMenusLW as ApplicationMenus,
} from './ApplicationMenusLW'
import EditorElement from './EditorElement'
import Inspector from './Inspector'
import { UserProvider } from './provider/UserProvider'
import { TrackChangesStyles } from './TrackChangesStyles'

const ManuscriptPageContainer: React.FC = () => {
  const [{ project, user, submission, person }, dispatch] = useStore(
    (state) => {
      return {
        manuscriptID: state.manuscriptID,
        project: state.project,
        user: state.user,
        submission: state.submission,
        person: state.person,
      }
    }
  )

  useEffect(() => {
    if (submission?.id && person) {
      dispatch({
        submission: submission,
        submissionId: submission.id as string,
        lwUser: person as Person,
      })
    }
  }, [submission, person, dispatch])

  const submissionId: string = submission?.id
  const permittedActionsData = useGetPermittedActions(submissionId)
  const permittedActions = permittedActionsData?.data?.permittedActions
  // lwRole must not be used to calculate permissions in the contenxt of manuscripts app.
  // lwRole is only for the dashboard
  const can = useCalcPermission({
    profile: user,
    project: project,
    permittedActions,
  })

  if (permittedActionsData.loading) {
    return <ManuscriptPlaceholder />
  }
  // else if (error || !data) {
  //   return (
  //     <UserProvider
  //       lwUser={lwUser}
  //       manuscriptUser={props.user}
  //       submissionId={submissionId}
  //     >
  //       <ExceptionDialog errorCode={'MANUSCRIPT_ARCHIVE_FETCH_FAILED'} />
  //     </UserProvider>
  //   )
  // }

  if (permittedActionsData.error) {
    const message = graphQLErrorMessage(
      permittedActionsData.error as ApolloError,
      'Request for user permissions from server failed.'
    )
    return <ReloadDialog message={message} />
  }

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
  const [lwUser] = useStore((store) => store.lwUser)
  const [modelMap] = useStore((store) => store.modelMap)
  const [submissionID] = useStore((store) => store.submissionID || '')
  const [manuscriptID, storeDispatch, getState] = useStore(
    (store) => store.manuscriptID
  )
  const [doc] = useStore((store) => store.doc)
  const [saveModel] = useStore((store) => store.saveModel)
  const [deleteModel] = useStore((store) => store.deleteModel)
  const [collaboratorsById] = useStore(
    (store) => store.collaboratorsById || new Map()
  )

  const can = usePermissions()

  const editor = useCreateEditor()

  const { state, dispatch, view } = editor

  const {
    saveTrackModel,
    trackModelMap,
    deleteTrackModel,
    getTrackModel,
  } = useTrackedModelManagement(
    doc,
    view,
    state,
    dispatch,
    saveModel,
    deleteModel,
    modelMap,
    () => getState().submission.attachments
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

  useEffect(() => {
    // Please note that using prosemirror-dev-toolkit may result in incosistent behaviour with from production
    // for example any dispatch that you pass to the editor props will be replaced with a dispatch from the dev-toolkit
    if (view && config.environment === 'development') {
      import('prosemirror-dev-toolkit')
        .then(({ applyDevTools }) => applyDevTools(view))
        .catch((error) => {
          console.error(
            'There was an error loading prosemirror-dev-toolkit',
            error.message
          )
        })
    }
  }, [view])

  const { setUsers } = useCommentStore()
  const { updateDocument } = useDocStore()
  const { init: initEditor, setEditorState, trackState } = useEditorStore()
  useEffect(() => setUsers(collaboratorsById), [collaboratorsById, setUsers])
  useEffect(() => view && initEditor(view), [view, initEditor])

  const hasPendingSuggestions = useMemo(() => {
    const { changeSet } = trackState || {}
    return changeSet && changeSet.pending.length > 0
  }, [trackState])

  useEffect(() => {
    storeDispatch({ hasPendingSuggestions })
  }, [storeDispatch, hasPendingSuggestions])

  const saveDocument = debounce((state: ManuscriptEditorState) => {
    storeDispatch({ doc: state.doc })
    updateDocument(manuscriptID, state.doc.toJSON())
  }, 500)

  useEffect(() => {
    const { trackState } = setEditorState(state)
    if (trackState && trackState.status !== TrackChangesStatus.viewSnapshots) {
      saveDocument(state)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const TABS = [
    'Content',
    // (config.features.commenting || config.features.productionNotes) &&
    'Comments',
    config.features.qualityControl && 'Quality',
    config.quarterback.enabled && 'History',
    config.features.fileManagement && 'Files',
  ].filter(Boolean) as Array<
    'Content' | 'Comments' | 'Quality' | 'History' | 'Files'
  >

  return (
    <RequirementsProvider modelMap={modelMap}>
      <UserProvider
        lwUser={lwUser}
        manuscriptUser={user}
        submissionId={submissionID}
      >
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
          <Inspector tabs={TABS} editor={editor} />
        </PageWrapper>
      </UserProvider>
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
