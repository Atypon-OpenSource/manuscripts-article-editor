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
import '@manuscripts/body-editor/styles/Editor.css'
import '@manuscripts/body-editor/styles/AdvancedEditor.css'
import '@manuscripts/body-editor/styles/popper.css'
import {
  IconButton,
  SaveStatus,
  SliderOffIcon,
  SliderOnIcon,
  Tooltip,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { useGlobalKeyboardShortcuts } from '../../hooks/use-global-keyboard-shortcuts'
import { useTrackingVisibility } from '../../hooks/use-tracking-visibility'
import {
  CapabilitiesProvider,
  useCalcPermission,
  usePermissions,
} from '../../lib/capabilities'
import { useStore } from '../../store'
import { SearchReplace } from '../SearchReplace'
import UtilitiesEffects from '../UtilitiesEffects'
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

const Main = styled.main`
  height: 100%;
  flex: 1;
  position: relative;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colors.background.primary};
  background-image: linear-gradient(
    180deg,
    rgba(250, 250, 250, 1) 0%,
    rgba(250, 250, 250, 1) 38px,
    rgba(255, 255, 255, 1) 38px,
    rgba(255, 255, 255, 1) 100%
  );
`

const PageContainer = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  box-sizing: border-box;
  width: 100%;
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.font.family.sans};
`

const ManuscriptPageContainer: React.FC = () => {
  // Enable global keyboard shortcuts
  useGlobalKeyboardShortcuts()

  const [{ project, user, permittedActions, isViewingMode }] = useStore(
    (state) => {
      return {
        project: state.project,
        user: state.user,
        permittedActions: state.permittedActions,
        isViewingMode: state.isViewingMode,
      }
    }
  )

  const can = useCalcPermission({
    profile: user,
    project: project,
    permittedActions,
    isViewingMode,
  })

  return (
    <CapabilitiesProvider can={can}>
      <PageContainer>
        <ManuscriptPageView />
      </PageContainer>
    </CapabilitiesProvider>
  )
}

const ManuscriptPageView: React.FC = () => {
  const can = usePermissions()
  const [isTrackingChangesVisible, toggleTrackingChangesVisibility] =
    useTrackingVisibility()

  const [{ isViewingMode, isComparingMode, savingProcess }] = useStore(
    (store) => ({
      isViewingMode: store.isViewingMode,
      isComparingMode: store.isComparingMode,
      savingProcess: store.savingProcess,
    })
  )

  const showTrackChangesToggle = !can.editWithoutTracking && !isViewingMode
  const isTrackingVisible =
    (showTrackChangesToggle && isTrackingChangesVisible) || isComparingMode

  return (
    <Wrapper className={`${isTrackingVisible && 'tracking-visible'}`}>
      <ManuscriptSidebar data-cy="manuscript-sidebar" />
      <PageWrapper>
        <Main data-cy="editor-main">
          <EditorContainer>
            <EditorContainerInner>
              <EditorHeader data-cy="editor-header">
                <ManuscriptMenusContainer>
                  <ManuscriptMenusContainerInner>
                    <MenusWrapper>
                      <ManuscriptMenus />
                      {savingProcess && <SaveStatus status={savingProcess} />}
                    </MenusWrapper>
                  </ManuscriptMenusContainerInner>

                  {showTrackChangesToggle && (
                    <TrackChangesToggleWrapper
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          toggleTrackingChangesVisibility()
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label="show tracked changes"
                      aria-pressed={isTrackingChangesVisible}
                    >
                      <Label>Show tracked changes</Label>
                      <IconButton
                        defaultColor={true}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTrackingChangesVisibility()
                        }}
                        aria-label={
                          isTrackingChangesVisible
                            ? 'Hide tracked changes'
                            : 'Show tracked changes'
                        }
                        tabIndex={-1}
                      >
                        {isTrackingChangesVisible ? (
                          <SliderOnIcon />
                        ) : (
                          <SliderOffIcon />
                        )}
                      </IconButton>
                    </TrackChangesToggleWrapper>
                  )}
                </ManuscriptMenusContainer>
                {can.seeEditorToolbar && <ManuscriptToolbar />}
                <SearchReplace />
              </EditorHeader>
              <EditorBody className="editor-body">
                <TrackChangesStyles>
                  <EditorElement />
                </TrackChangesStyles>
              </EditorBody>
            </EditorContainerInner>
          </EditorContainer>
        </Main>
        <Inspector data-cy="inspector" />
        <UtilitiesEffects />
        <Tooltip
          anchorSelect="[data-tooltip-content]:not([data-tooltip-id])"
          place="bottom"
          style={{ zIndex: 5000 }}
        />
      </PageWrapper>
    </Wrapper>
  )
}

const TrackChangesToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  padding: 0px 8px;

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.outline.focus};
    outline-offset: -2px;
  }
`

const Label = styled.div`
  padding-right: 8px;
  white-space: nowrap;
`
const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  color: rgb(53, 53, 53);
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Lato, sans-serif;
`
export const ManuscriptMenusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.background.secondary};
`
export const ManuscriptMenusContainerInner = styled.div`
  width: 100%;
  max-width: ${(props) => props.theme.grid.editorMaxWidth}px;
  margin: 0 auto;
  padding: ${(props) => props.theme.grid.unit / 2}px
    ${(props) => props.theme.grid.unit * 5}px
    ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 15}px;
  box-sizing: border-box;
`

const MenusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.grid.unit * 2}px;
`

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 2;
  overflow: hidden;
`

export default ManuscriptPageContainer
