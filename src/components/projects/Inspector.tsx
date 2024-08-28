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

import { usePermissions } from '@manuscripts/style-guide'
import React, { useEffect, useState } from 'react'

import { getConfig } from '../../config'
import { useStore } from '../../store'
import { CommentsPanel } from '../comments/CommentsPanel'
import { FileManager } from '../FileManager/FileManager'
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

const Inspector: React.FC = () => {
  const [store] = useStore((store) => ({
    selectedCommentKey: store.selectedCommentKey,
    selectedSuggestionID: store.selectedSuggestionID,
  }))
  const config = getConfig()

  const can = usePermissions()

  const comment = store.selectedCommentKey
  const suggestion = store.selectedSuggestionID
  const [tabIndex, setTabIndex] = useState(1)

  let index = 0
  const CONTENT_TAB_INDEX = index++
  const COMMENTS_TAB_INDEX = index++
  const SUGGESTIONS_TAB_INDEX = !can.editWithoutTracking ? index++ : -1
  const FILES_TAB_INDEX = config.features.fileManagement ? index++ : -1

  useEffect(() => {
    if (comment) {
      setTabIndex(COMMENTS_TAB_INDEX)
    }
  }, [comment, COMMENTS_TAB_INDEX])

  useEffect(() => {
    if (suggestion) {
      setTabIndex(SUGGESTIONS_TAB_INDEX)
    }
  }, [suggestion, SUGGESTIONS_TAB_INDEX])

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
              {tabIndex === CONTENT_TAB_INDEX && <ContentTab key="content" />}
            </InspectorTabPanel>
            <InspectorTabPanel key="Comments" data-cy="comments">
              {tabIndex === COMMENTS_TAB_INDEX && (
                <CommentsPanel key="comments" />
              )}
            </InspectorTabPanel>
            {!can.editWithoutTracking && (
              <InspectorTabPanel key="History" data-cy="history">
                {tabIndex === SUGGESTIONS_TAB_INDEX && (
                  <TrackChangesPanel key="track-changes" />
                )}
              </InspectorTabPanel>
            )}
            {config.features.fileManagement && (
              <InspectorTabPanel key="Files" data-cy="files">
                {tabIndex === FILES_TAB_INDEX && <FileManager key="files" />}
              </InspectorTabPanel>
            )}
          </PaddedInspectorTabPanels>
        </InspectorTabs>
      </InspectorContainer>
    </Panel>
  )
}

export default Inspector
