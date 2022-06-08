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

import Arrow from '@manuscripts/assets/react/ArrowDownBlack'
import {
  Manuscript,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React, { useEffect } from 'react'
import { useHistory as useRouterHistory } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { SnapshotStatus, useHistory } from '../../hooks/use-history'
import { InspectorContainer } from '../Inspector'
import { HistoryPanel } from '../inspector/History'
import { Main } from '../Page'
import Panel from '../Panel'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
} from '../projects/EditorContainer'
import { ResizingInspectorButton } from '../ResizerButtons'
import { HistoricalManuscriptView } from './HistoricalManuscriptView'
import { HistoryMetadata } from './HistoryMetadata'
import { HistorySidebar } from './HistorySidebar'

const HistoryEditorBody = styled(EditorBody)`
  padding: 20px 24px;
`

const BackLinkWrapper = styled.div`
  margin-bottom: 20px;
`

const BackLink = styled(Link)`
  display: inline-block;
  padding: 8px 16px;
  color: white;
  background: ${(props) =>
    props.theme.colors.button.primary.background.default};
  text-decoration: inherit;
  border-radius: ${(props) => props.theme.grid.radius.default};

  svg {
    padding-right: 4px;
    transform: rotate(90deg);
  }

  svg path {
    stroke: white;
  }
`

const HistoryPanelContainer = styled.div`
  max-height: 100%;
  overflow-y: auto;
`

interface Props {
  project: Project
  user: UserProfile
  manuscript: Manuscript
  snapshotID: string
  handleClose: () => void
}

export const HistoricalView: React.FC<Props> = ({
  project,
  manuscript,
  snapshotID,
  handleClose,
  user,
}) => {
  const {
    loadSnapshotStatus,
    loadSnapshot,
    currentSnapshot,
    snapshotsList,
  } = useHistory(project._id)

  const browserHistory = useRouterHistory()

  useEffect(() => {
    // promise rejection in openSnapshot is handled by setting openSnapshotStatus
    loadSnapshot(snapshotID, manuscript._id)
  }, [project, snapshotID, manuscript, loadSnapshot])

  if (loadSnapshotStatus !== SnapshotStatus.Done || !currentSnapshot) {
    return null
  }

  return (
    <React.Fragment>
      <HistorySidebar
        project={project}
        manuscript={manuscript}
        doc={currentSnapshot.doc}
      />

      <Main>
        <EditorContainer>
          <EditorContainerInner>
            <HistoryEditorBody>
              <BackLinkWrapper>
                <BackLink
                  to="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleClose()
                  }}
                >
                  <Arrow />
                  <span>Back to Current Version</span>
                </BackLink>
              </BackLinkWrapper>
              <HistoryMetadata
                manuscript={manuscript}
                modelMap={currentSnapshot.modelMap}
              />
              <HistoricalManuscriptView
                project={project}
                browserHistory={browserHistory}
                manuscript={manuscript}
                currentSnapshot={currentSnapshot}
                user={user}
              />
            </HistoryEditorBody>
          </EditorContainerInner>
        </EditorContainer>
      </Main>

      <Panel
        name="history"
        minSize={300}
        direction="row"
        side="start"
        hideWhen="max-width: 900px"
        resizerButton={ResizingInspectorButton}
      >
        <InspectorContainer>
          <HistoryPanelContainer>
            <HistoryPanel
              project={project}
              manuscriptID={manuscript._id}
              snapshotsList={snapshotsList}
              currentUserId=""
            />
          </HistoryPanelContainer>
        </InspectorContainer>
      </Panel>
    </React.Fragment>
  )
}
