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

import { FileAttachment, ManuscriptOutline } from '@manuscripts/body-editor'
import React, { useState } from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'
import { AIWritingAssistant } from '../ai'
import PageSidebar from '../PageSidebar'

const ManuscriptSidebar: React.FC = () => {
  const can = usePermissions()
  const [view] = useStore((store) => store.view)
  const [editor] = useStore((store) => store.editor)
  const [files] = useStore((store) => store.files)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  if (!editor) {
    return null
  }

  return (
    <PageSidebar
      direction={'row'}
      hideWhen={'max-width: 900px'}
      minSize={260}
      name={'sidebar'}
      side={'end'}
      sidebarTitle={''}
      sidebarFooter={''}
    >
      <SidebarContainer>
        <TabBar>
          <Tab
            $active={!showAIAssistant}
            onClick={() => setShowAIAssistant(false)}
          >
            Outline
          </Tab>
          <Tab
            $active={showAIAssistant}
            onClick={() => setShowAIAssistant(true)}
          >
            🤖 AI Assistant
          </Tab>
        </TabBar>
        
        <ContentArea>
          {!showAIAssistant && (
            <ManuscriptOutline
              doc={editor.state?.doc || null}
              view={view}
              can={can}
              getFiles={() => files as FileAttachment[]}
            />
          )}
          {showAIAssistant && <AIWritingAssistant />}
        </ContentArea>
      </SidebarContainer>
    </PageSidebar>
  )
}

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.secondary};
  background: ${(props) => props.theme.colors.background.primary};
`

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  background: ${(props) =>
    props.$active
      ? props.theme.colors.background.primary
      : props.theme.colors.background.secondary};
  border: none;
  border-bottom: ${(props) =>
    props.$active
      ? `2px solid ${props.theme.colors.button.primary.background.default}`
      : '2px solid transparent'};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.text.primary
      : props.theme.colors.text.secondary};
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.background.tertiary};
  }
`

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`

export default ManuscriptSidebar
