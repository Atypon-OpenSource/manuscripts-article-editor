/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2026 Atypon Systems LLC. All Rights Reserved.
 */
import React from 'react'
import {
  IconButton,
  SaveStatus,
  SliderOffIcon,
  SliderOnIcon,
} from '@manuscripts/style-guide'
import styled, { createGlobalStyle } from 'styled-components'

const SMALL = 1160;

import { SearchReplace } from '../SearchReplace'
import { EditorHeader } from './EditorContainer'
import { ManuscriptMenus } from './ManuscriptMenus'
import { ManuscriptToolbar } from './ManuscriptToolbar'
import { useTrackingVisibility } from '../../hooks/use-tracking-visibility'
import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'

export const EditorHeaderGroup: React.FC = () => {
  const can = usePermissions()
  const [isTrackingChangesVisible, toggleTrackingChangesVisibility] =
    useTrackingVisibility()

  const [{ savingProcess, isViewingMode }] = useStore((store) => ({
    isViewingMode: store.isViewingMode,
    isComparingMode: store.isComparingMode,
    savingProcess: store.savingProcess,
  }))

  const showTrackChangesToggle = !can.editWithoutTracking && !isViewingMode

  const label = isTrackingChangesVisible
    ? 'Hide tracked changes'
    : 'Show tracked changes'

  return (
    <EditorHeader data-cy="editor-header">
      <ToolTipGlobalCss />
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
            aria-label={label}
            aria-pressed={isTrackingChangesVisible}
            data-tooltip-content={label}
            data-tooltip-class-name={"track-changes-toggle-tooltip"}
          >
            <Label>{label}</Label>
            <IconButton
              defaultColor={true}
              onClick={(e) => {
                e.stopPropagation()
                toggleTrackingChangesVisibility()
              }}
              aria-label={label}
              tabIndex={-1}
            >
              {isTrackingChangesVisible ? <SliderOnIcon /> : <SliderOffIcon />}
            </IconButton>
          </TrackChangesToggleWrapper>
        )}
      </ManuscriptMenusContainer>
      {can.seeEditorToolbar && <ManuscriptToolbar />}
      <SearchReplace />      
    </EditorHeader>
  )
}

const ToolTipGlobalCss = createGlobalStyle`
  @media (min-width: ${SMALL + 1}px) {
    .track-changes-toggle-tooltip {
      display: none !important;
    }
  }
`;

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
  @media (max-width: ${SMALL}px) {
    display: none !important;
  }
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
