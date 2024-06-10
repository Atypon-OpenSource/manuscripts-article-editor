/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */

import { FileManager, usePermissions } from '@manuscripts/style-guide'
import React, { useEffect, useState } from 'react'

import config from '../../config'
import { useCreateEditor } from '../../hooks/use-create-editor'
import { useStore } from '../../store'
import { CommentsPanel } from '../comments/CommentsPanel'
import {
  InspectorContainer,
  InspectorTab,
  InspectorTabList,
  InspectorTabPanel,
  InspectorTabs,
  PaddedInspectorTabPanels,
} from '../Inspector'
import Panel from '../Panel'
import { ResizingInspectorButton } from '../ResizerButtons'
import { TrackChangesPanel } from '../track-changes/TrackChangesPanel'
import { ContentTab } from './ContentTab'

interface Props {
  editor: ReturnType<typeof useCreateEditor>
}
const Inspector: React.FC<Props> = ({ editor }) => {
  const [store] = useStore((store) => ({
    saveTrackModel: store.saveTrackModel,
    deleteTrackModel: store.deleteTrackModel,
    trackModelMap: store.trackModelMap,
    fileManagement: store.fileManagement,
    files: store.files,
    selectedCommentKey: store.selectedCommentKey,
    selectedSuggestionID: store.selectedSuggestionID,
  }))

  const { state, dispatch } = editor

  const comment = store.selectedCommentKey
  const suggestion = store.selectedSuggestionID
  const [tabIndex, setTabIndex] = useState(1)
  const COMMENTS_TAB_INDEX = 1
  const SUGGESTIONS_TAB_INDEX = 2
  const FILES_TAB_INDEX = 3

  useEffect(() => {
    if (comment) {
      setTabIndex(COMMENTS_TAB_INDEX)
    }
  }, [comment])

  useEffect(() => {
    if (suggestion) {
      setTabIndex(SUGGESTIONS_TAB_INDEX)
    }
  }, [suggestion, SUGGESTIONS_TAB_INDEX])

  const can = usePermissions()
  return (
    <Panel
      data-cy="inspector"
      name={'inspector'}
      minSize={400}
      direction={'row'}
      side={'start'}
      hideWhen={'max-width: 900px'}
      resizerButton={ResizingInspectorButton}
    >
      <InspectorContainer>
        <InspectorTabs index={tabIndex} onChange={setTabIndex}>
          <InspectorTabList>
            <InspectorTab data-cy="content-button">Content</InspectorTab>
            <InspectorTab data-cy="comments-button">Comments</InspectorTab>
            {!can.editWithoutTracking && (
              <InspectorTab data-cy="history-button">History</InspectorTab>
            )}
            {config.features.fileManagement && (
              <InspectorTab data-cy="files-button">Files</InspectorTab>
            )}
          </InspectorTabList>
          <PaddedInspectorTabPanels>
            <InspectorTabPanel key="Content" data-cy="content">
              <ContentTab state={state} dispatch={dispatch} key="content" />
            </InspectorTabPanel>
            <InspectorTabPanel key="Comments" data-cy="comments">
              {tabIndex == COMMENTS_TAB_INDEX && (
                <CommentsPanel key="comments" />
              )}
            </InspectorTabPanel>
            {!can.editWithoutTracking && (
              <InspectorTabPanel key="History" data-cy="history">
                {tabIndex == SUGGESTIONS_TAB_INDEX && (
                  <TrackChangesPanel key="track-changes" />
                )}
              </InspectorTabPanel>
            )}
            {config.features.fileManagement && (
              <InspectorTabPanel key="Files" data-cy="files">
                {tabIndex == FILES_TAB_INDEX && (
                  <FileManager
                    can={can}
                    files={store.files}
                    enableDragAndDrop={true}
                    modelMap={store.trackModelMap}
                    // @ts-ignore
                    saveModel={store.saveTrackModel}
                    deleteModel={store.deleteTrackModel}
                    fileManagement={store.fileManagement}
                  />
                )}
              </InspectorTabPanel>
            )}
          </PaddedInspectorTabPanels>
        </InspectorTabs>
      </InspectorContainer>
    </Panel>
  )
}

export default Inspector
