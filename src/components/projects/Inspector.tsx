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

import {
  BookIcon,
  ChatIcon,
  ManuscriptIcon,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useEffect, useState } from 'react'

import { InspectorPrimaryTabs } from '../../hooks/use-inspector-tabs-context'
import { useStore } from '../../store'
import { CommentsPanel } from '../comments/CommentsPanel'
import { FileManager } from '../FileManager/FileManager'
import {
  InspectorContainer,
  InspectorTabPanel,
  InspectorTabs,
  PaddedInspectorTabPanels,
  PrimaryTabList,
  Spacer,
} from '../Inspector'
import { SnapshotsList } from '../inspector/SnapshotsList'
import Panel from '../Panel'
import { ResizingInspectorButton } from '../ResizerButtons'
import { TrackChangesPanel } from '../track-changes/TrackChangesPanel'
import VersionHistoryDropdown from '../VersionHistoryDropdown'
import { InspectorTab } from '../inspector/InspectorTab'

const Inspector: React.FC = () => {
  const [store] = useStore((store) => ({
    selectedCommentKey: store.selectedCommentKey,
    selectedSuggestionID: store.selectedSuggestionID,
    inspectorOpenTabs: store.inspectorOpenTabs,
    isViewingMode: store.isViewingMode,
  }))

  const can = usePermissions()

  const comment = store.selectedCommentKey
  const suggestion = store.selectedSuggestionID
  const inspectorOpenTabs = store.inspectorOpenTabs
  const [tabIndex, setTabIndex] = useState(0)

  let index = 0
  const COMMENTS_TAB_INDEX = index++
  const HISTORY_TAB_INDEX = !can.editWithoutTracking ? index++ : -1
  const FILES_TAB_INDEX = index++
  useEffect(() => {
    if (comment) {
      setTabIndex(COMMENTS_TAB_INDEX)
    }
  }, [comment, COMMENTS_TAB_INDEX])

  useEffect(() => {
    if (inspectorOpenTabs?.primaryTab === InspectorPrimaryTabs.Files) {
      setTabIndex(FILES_TAB_INDEX)
    }
  }, [inspectorOpenTabs, FILES_TAB_INDEX])

  useEffect(() => {
    if (suggestion) {
      setTabIndex(HISTORY_TAB_INDEX)
    }
  }, [suggestion, HISTORY_TAB_INDEX])

  return (
    <Panel
      name={'inspector'}
      minSize={400}
      direction={'row'}
      side={'start'}
      hideWhen={'max-width: 900px'}
      resizerButton={ResizingInspectorButton}
    >
      {store.isViewingMode ? (
        <SnapshotsList />
      ) : (
        <InspectorContainer data-cy="inspector">
          <InspectorTabs selectedIndex={tabIndex} onChange={setTabIndex}>
            <PrimaryTabList>
              <InspectorTab
                cy="comments-button"
                icon={<ChatIcon />}
                isVisible={tabIndex === COMMENTS_TAB_INDEX}
              >
                Comments
              </InspectorTab>
              {!can.editWithoutTracking && (
                <InspectorTab
                  cy="history-button"
                  icon={<BookIcon />}
                  isVisible={tabIndex === HISTORY_TAB_INDEX}
                >
                  Changes
                </InspectorTab>
              )}
              <InspectorTab
                cy="files-button"
                icon={<ManuscriptIcon />}
                isVisible={tabIndex === FILES_TAB_INDEX}
              >
                Files
              </InspectorTab>
              <Spacer />
              <VersionHistoryDropdown />
            </PrimaryTabList>
            <PaddedInspectorTabPanels>
              <InspectorTabPanel key="Comments" data-cy="comments">
                {tabIndex === COMMENTS_TAB_INDEX && (
                  <CommentsPanel key="comments" />
                )}
              </InspectorTabPanel>
              {!can.editWithoutTracking && (
                <InspectorTabPanel key="History" data-cy="history">
                  {tabIndex === HISTORY_TAB_INDEX && (
                    <TrackChangesPanel key="track-changes" />
                  )}
                </InspectorTabPanel>
              )}
              <InspectorTabPanel key="Files" data-cy="files">
                {tabIndex === FILES_TAB_INDEX && <FileManager key="files" />}
              </InspectorTabPanel>
            </PaddedInspectorTabPanels>
          </InspectorTabs>
        </InspectorContainer>
      )}
    </Panel>
  )
}

export default Inspector
