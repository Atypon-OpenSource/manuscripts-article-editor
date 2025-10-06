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

import { LanguageDropdown } from '@manuscripts/body-editor'
import {
  DotsIcon,
  DropdownContainer,
  DropdownList,
  useDropdown,
} from '@manuscripts/style-guide'
import {
  TrackChangesStatus,
  trackCommands,
} from '@manuscripts/track-changes-plugin'
import React from 'react'
import styled from 'styled-components'

import useExecCmd from '../hooks/use-exec-cmd'
import { useStore } from '../store/useStore'

const DocumentOptionsDropdown: React.FC = () => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()
  const execCmd = useExecCmd()
  const [storeState] = useStore((s) => ({
    doc: s.doc,
    view: s.view,
    languages: s.languages,
  }))

  const handleLanguageChange = async (languageCode: string) => {
    if (storeState.view) {
      const { state, dispatch } = storeState.view
      const tr = state.tr
      tr.setDocAttribute('primaryLanguageCode', languageCode)
      dispatch(tr)
    }
  }

  return (
    <DropdownContainer ref={wrapperRef}>
      <ToggleDropdownButton
        data-cy="document-options-button"
        title="Document Options"
        onClick={toggleOpen}
      >
        <DotsIcon />
      </ToggleDropdownButton>

      {isOpen && (
        <HistoryDropdownList
          data-cy="history-dropdown"
          direction="right"
          width={192}
          top={5}
          onClick={toggleOpen}
        >
          <DropdownItem
            data-cy="version-history-button"
            onClick={() =>
              execCmd(
                trackCommands.setTrackingStatus(
                  TrackChangesStatus.viewSnapshots
                )
              )
            }
          >
            Version history
          </DropdownItem>
          <LanguageDropdown
            showButton={true}
            buttonLabel="Document language"
            currentLanguage={storeState.doc?.attrs?.primaryLanguageCode || 'en'}
            onLanguageSelect={handleLanguageChange}
            onCloseParent={toggleOpen}
            languages={storeState.languages}
          />
        </HistoryDropdownList>
      )}
    </DropdownContainer>
  )
}

export default DocumentOptionsDropdown

const ToggleDropdownButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px 16px;
  &:focus {
    outline: none;
  }
`

const DropdownItem = styled.div`
  font-family: ${(props) => props.theme.font.family.Lato};
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 16px;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`

const HistoryDropdownList = styled(DropdownList)`
  top: 0;
  right: 50%;
  border-radius: 8px;
`
