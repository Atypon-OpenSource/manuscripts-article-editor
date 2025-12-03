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

import { PrimaryButton, SecondaryButton } from '@manuscripts/style-guide'
import {
  TrackChangesStatus,
  trackCommands,
} from '@manuscripts/track-changes-plugin'
import { ManuscriptNode, schema } from '@manuscripts/transform'
import { EditorState } from 'prosemirror-state'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import useExecCmd from '../../hooks/use-exec-cmd'
import { ManuscriptSnapshot } from '../../lib/doc'
import { useStore } from '../../store'
import { FormattedDateTime } from '../FormattedDateTime'
import { CompareDocumentsModal } from '../tools/CompareDocumentsModal'

export const SnapshotsList: React.FC = () => {
  const [{ view, getSnapshot, snapshots }] = useStore((store) => ({
    view: store.view,
    getSnapshot: store.getSnapshot,
    snapshots: store.snapshots,
  }))

  const execCmd = useExecCmd()
  const [selectedSnapshot, setSelectedSnapshot] = useState<ManuscriptSnapshot>()
  const [doc, setDoc] = useState<ManuscriptNode>()
  const [showCompareModal, setShowCompareModal] = useState(false)

  const sortedSnapshots = useMemo(
    () => snapshots.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [snapshots]
  )
  if (!view) {
    return null
  }

  const hydrateDocFromJSON = (doc: ManuscriptNode) => {
    const state = EditorState.create({
      doc: doc,
      plugins: view.state.plugins,
    })
    view.updateState(state)
  }

  const handleSelectSnapshot = async (id: string) => {
    if (id === selectedSnapshot?.id) {
      return
    }
    const snapshot = await getSnapshot(id)
    if (snapshot) {
      if (!doc) {
        setDoc(view.state.doc)
      }
      setSelectedSnapshot(snapshot)
      hydrateDocFromJSON(schema.nodeFromJSON(snapshot.snapshot))
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.viewSnapshots))
    }
  }

  const handleSelectCurrent = () => {
    if (!doc) {
      console.warn('No original doc found')
      return
    }
    setDoc(undefined)
    setSelectedSnapshot(undefined)
    hydrateDocFromJSON(doc)
    execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.viewSnapshots))
  }

  const handleClose = () => {
    if (selectedSnapshot) {
      handleSelectCurrent()
    }
    execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.enabled))
  }

  return (
    <>
      <HeaderContainer>
        <Header>
          <>Version history </>
          <SecondaryText>Snapshots created on task completion </SecondaryText>
        </Header>
        <CloseButton onClick={handleClose}>
          <CloseIcon /> Close
        </CloseButton>
      </HeaderContainer>
      <SnapshotListContainer>
        <SnapshotListItem
          onClick={(e) => {
            if (selectedSnapshot) {
              handleSelectCurrent()
            }
          }}
          key={'current'}
          className={!selectedSnapshot ? 'selected' : ''}
        >
          <SnapshotName>{'Current version'}</SnapshotName>
        </SnapshotListItem>
        {sortedSnapshots.map((snapshot) => {
          return (
            <SnapshotListItem
              onClick={(e) => {
                handleSelectSnapshot(snapshot.id)
              }}
              key={snapshot.id}
              className={snapshot.id === selectedSnapshot?.id ? 'selected' : ''}
            >
              <SnapshotName>{snapshot.name}</SnapshotName>

              <SecondaryText>
                <FormattedDateTime
                  date={new Date(snapshot.createdAt).getTime() / 1000}
                />
              </SecondaryText>
            </SnapshotListItem>
          )
        })}
      </SnapshotListContainer>
      <ButtonContainer>
        <PrimaryButton onClick={() => setShowCompareModal(true)}>
          Compare Snapshots
        </PrimaryButton>
      </ButtonContainer>
      {showCompareModal && (
        <CompareDocumentsModal
          snapshots={sortedSnapshots}
          loading={false}
          error={null}
          onCancel={() => setShowCompareModal(false)}
        />
      )}
    </>
  )
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 6}px;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const CloseButton = styled(SecondaryButton)`
  padding: 4px ${(props) => props.theme.grid.unit * 3}px;
  font-size: 14px;
`
const CloseIcon = styled.div`
  display: inline-flex;
  height: 12px;
  padding: 8px;
  position: relative;
  width: 12px;

  box-shadow: none;
  text-indent: -99999px;
  ::before,
  ::after {
    background-color: ${(props) => props.theme.colors.text.secondary};
    border-radius: 2px;
    content: ' ';
    display: block;
    height: 14px;
    transform: rotate(-45deg);
    width: 2px;
    position: absolute;
    top: calc(50% - 7px);
    left: calc(50% - 1px);
  }
  ::after {
    transform: rotate(45deg);
  }
`
const SnapshotListContainer = styled.div`
  display: block;
  overflow: auto;
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`
const SnapshotListItem = styled(SecondaryButton)`
  background: ${(props) => props.theme.colors.background.primary} !important;
  display: inline-block;
  text-align: left;
  width: 100%;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 6}px;
  white-space: nowrap;
  border: none;
  &:not([disabled]):hover {
    background: ${(props) => props.theme.colors.background.fifth} !important;
  }

  &.selected {
    background: ${(props) => props.theme.colors.background.fifth} !important;
    border-top: 1px solid #bce7f6 !important;
    border-bottom: 1px solid #bce7f6 !important;
  }
`

const SnapshotName = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.normal};
  display: flex;
  align-items: center;
`
const SecondaryText = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`

const ButtonContainer = styled.div`
  padding: ${(props) => props.theme.grid.unit * 2}px;
  border-top: 1px solid ${(props) => props.theme.colors.border.tertiary};
  display: flex;
  justify-content: flex-end;
`
