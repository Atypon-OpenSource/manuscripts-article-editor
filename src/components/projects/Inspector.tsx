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

import { detectInconsistencyPluginKey } from '@manuscripts/body-editor'
import {
  BookIcon,
  ChatIcon,
  DangerIcon,
  ManuscriptIcon,
} from '@manuscripts/style-guide'
import React, { useEffect, useState } from 'react'

import {
  InspectorPanel,
  useInspectorTabsParentControl,
} from '../../hooks/use-inspector-tabs-context'
import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'
import { CommentsPanel } from '../comments/CommentsPanel'
import DocumentOptionsDropdown from '../DocumentOptionsDropdown'
import { FileManager } from '../FileManager/FileManager'
import {
  ErrorBadge,
  IconWrapper,
  InspectorContainer,
  InspectorTabPanel,
  InspectorTabs,
  PaddedInspectorTabPanels,
  PrimaryTabList,
  Spacer,
  WarningBadge,
} from '../Inspector'
import { InspectorTab } from '../inspector/InspectorTab'
import { IssuesPanel } from '../inspector/IssuesPanel'
import { SnapshotsList } from '../inspector/SnapshotsList'
import Panel from '../Panel'
import { ResizingInspectorButton } from '../ResizerButtons'
import { TrackChangesPanel } from '../track-changes/TrackChangesPanel'

export type PluginInspectorTab = {
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

const Inspector: React.FC = () => {
  useInspectorTabsParentControl()
  const [store] = useStore((store) => ({
    selectedCommentKey: store.selectedCommentKey,
    selectedSuggestionID: store.selectedSuggestionID,
    inspectorOpenTabs: store.inspectorOpenTabs,
    isViewingMode: store.isViewingMode,
    view: store.view,
    inconsistencies: store.inconsistencies || [],
    isComparingMode: store.isComparingMode,
  }))
  const inconsistenciesCount = store.inconsistencies?.length
  let errorCount = 0
  let warningCount = 0

  store.inconsistencies?.forEach((i) => {
    if (i.severity === 'error') {
      errorCount++
    } else if (i.severity === 'warning') {
      warningCount++
    }
  })

  const [pluginTab] = useStore((store) => store.pluginInspectorTab)

  const can = usePermissions()

  const comment = store.selectedCommentKey
  const suggestion = store.selectedSuggestionID
  const inspectorOpenTabs = store.inspectorOpenTabs
  const [tabIndex, setTabIndex] = useState(0)

  let index = 0
  const COMMENTS_TAB_INDEX = index++
  const HISTORY_TAB_INDEX = !can.editWithoutTracking ? index++ : -1
  const FILES_TAB_INDEX = index++
  const ISSUES_TAB_INDEX = index++
  const PLUGIN_TAB = pluginTab ? index++ : -2

  useEffect(() => {
    if (comment) {
      setTabIndex(COMMENTS_TAB_INDEX)
    }
  }, [comment, COMMENTS_TAB_INDEX])

  useEffect(() => {
    if (suggestion) {
      setTabIndex(HISTORY_TAB_INDEX)
    }
  }, [suggestion, HISTORY_TAB_INDEX])

  useEffect(() => {
    if (inspectorOpenTabs?.primaryTab === InspectorPanel.Primary.Files) {
      setTabIndex(FILES_TAB_INDEX)
    } else if (
      inspectorOpenTabs?.primaryTab === InspectorPanel.Primary.Quality
    ) {
      setTabIndex(ISSUES_TAB_INDEX)
    }
  }, [inspectorOpenTabs, FILES_TAB_INDEX, ISSUES_TAB_INDEX])

  // Effect to control warning decorations visibility
  useEffect(() => {
    if (store.view) {
      const tr = store.view.state.tr
      tr.setMeta(detectInconsistencyPluginKey, tabIndex === ISSUES_TAB_INDEX)
      store.view.dispatch(tr)
    }
  }, [tabIndex, ISSUES_TAB_INDEX, store.view])

  if (store.isComparingMode) {
    return (
      <Panel
        name={'inspector'}
        minSize={400}
        direction={'row'}
        side={'start'}
        hideWhen={'max-width: 900px'}
        resizerButton={ResizingInspectorButton}
      >
        <InspectorContainer data-cy="inspector">
          <TrackChangesPanel key="track-changes" />
        </InspectorContainer>
      </Panel>
    )
  }

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
              <InspectorTab
                cy="issues-button"
                icon={
                  <IconWrapper>
                    <DangerIcon />
                    {errorCount > 0 && (
                      <ErrorBadge>{inconsistenciesCount}</ErrorBadge>
                    )}
                    {errorCount === 0 && warningCount > 0 && (
                      <WarningBadge>{warningCount}</WarningBadge>
                    )}
                  </IconWrapper>
                }
                isVisible={tabIndex === ISSUES_TAB_INDEX}
              >
                Issues
              </InspectorTab>
              {pluginTab && (
                <InspectorTab
                  cy="plugin-button"
                  icon={<IconWrapper>{pluginTab.icon}</IconWrapper>}
                  isVisible={tabIndex === PLUGIN_TAB}
                >
                  {pluginTab.title}
                </InspectorTab>
              )}
              <Spacer />
              <DocumentOptionsDropdown />
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
              <InspectorTabPanel key="Issues" data-cy="issues">
                {tabIndex === ISSUES_TAB_INDEX && <IssuesPanel key="issues" />}
              </InspectorTabPanel>
              {pluginTab && (
                <InspectorTabPanel key="Plugin" data-cy="plugin">
                  {tabIndex === PLUGIN_TAB && pluginTab.content}
                </InspectorTabPanel>
              )}
            </PaddedInspectorTabPanels>
          </InspectorTabs>
        </InspectorContainer>
      )}
    </Panel>
  )
}

export default Inspector
