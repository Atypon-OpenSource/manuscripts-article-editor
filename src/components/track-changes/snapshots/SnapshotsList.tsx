/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import { Evt, SnapshotLabel } from '@manuscripts/quarterback-types'
import {
  TrackChangesStatus,
  trackCommands,
} from '@manuscripts/track-changes-plugin'
import React, { useCallback, useState } from 'react'
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiTrash,
} from 'react-icons/fi'
import styled from 'styled-components'

import { useEditorStore } from '../useEditorStore'
import { useSnapshotStore } from '../../../quarterback/useSnapshotStore'
import { EditSnapshotForm, UpdateSnapshotFormValues } from './EditSnapshotForm'

interface IProps {
  className?: string
}

export const SnapshotsList = (props: IProps) => {
  const { className } = props
  const snapshotStore = useSnapshotStore()
  const { docToJSON, execCmd, hydrateDocFromJSON } = useEditorStore()
  const { snapshots, inspectedSnapshot } = snapshotStore
  const [isVisible, setIsVisible] = useState(true)
  const [editedSnapId, setEditedSnapId] = useState<string | undefined>()
  const isBeingInspected = useCallback(
    (snap: SnapshotLabel) => inspectedSnapshot?.id === snap.id,
    [inspectedSnapshot]
  )

  async function handleInspectSnapshot(snap: SnapshotLabel) {
    if (!inspectedSnapshot) {
      snapshotStore.setOriginalPmDoc(docToJSON())
    } else if (isBeingInspected(snap)) {
      handleResumeEditing()
      return
    }
    const resp = await snapshotStore.inspectSnapshot(snap.id)
    if (resp.ok) {
      hydrateDocFromJSON(resp.data.snapshot as any)
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.viewSnapshots))
    }
  }
  function handleResumeEditing() {
    snapshotStore.resumeEditing()
    const { originalPmDoc } = snapshotStore
    if (originalPmDoc) {
      hydrateDocFromJSON(originalPmDoc)
    }
    execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.enabled))
  }
  function handleEditSnapshot(doc: SnapshotLabel) {
    if (editedSnapId === doc.id) {
      setEditedSnapId(undefined)
    } else {
      setEditedSnapId(doc.id)
    }
  }
  function handleDeleteSnapshot(snap: SnapshotLabel) {
    snapshotStore.deleteSnapshot(snap.id)
  }
  async function* handleEditSubmit(
    values: UpdateSnapshotFormValues
  ): AsyncGenerator<Evt<boolean>, void, unknown> {
    if (!editedSnapId) {
      yield { e: 'error', error: 'No edited doc' }
      return
    }
    try {
      const resp = await snapshotStore.updateSnapshot(editedSnapId, values)
      if (resp.ok) {
        yield { e: 'ok', data: resp.data }
      } else {
        yield { e: 'error', error: resp.error }
      }
    } catch (err: any) {
      yield { e: 'error', error: err.toString() }
    } finally {
      yield { e: 'finally' }
    }
  }
  return (
    <>
      <Header>
        <button onClick={() => setIsVisible(!isVisible)} className="header-btn">
          <span>
            {isVisible ? (
              <FiChevronDown size={16} />
            ) : (
              <FiChevronRight size={16} />
            )}
          </span>
          <Title>Snapshots</Title>
        </button>
        <button
          className={`inspect-btn ${inspectedSnapshot ? '' : 'hidden'}`}
          onClick={() => handleResumeEditing()}
        >
          Stop inspecting
        </button>
      </Header>
      <List className={`${className} ${isVisible ? '' : 'hidden'}`}>
        {snapshots.map((snap: SnapshotLabel) => (
          <SnapListItem key={`${snap.id}`}>
            <TitleWrapper>
              {editedSnapId === snap.id ? (
                <EditSnapshotForm
                  snapshot={snap}
                  onSubmit={handleEditSubmit}
                  onCancel={() => setEditedSnapId(undefined)}
                />
              ) : (
                <h4>{snap.name}</h4>
              )}
              <IconButtons>
                <Button onClick={() => handleInspectSnapshot(snap)}>
                  {isBeingInspected(snap) ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </Button>
                <Button onClick={() => handleEditSnapshot(snap)}>
                  <FiEdit3 size={16} />
                </Button>
                <Button onClick={() => handleDeleteSnapshot(snap)}>
                  <FiTrash size={16} />
                </Button>
              </IconButtons>
            </TitleWrapper>
            <small>{new Date(snap.createdAt).toLocaleString()}</small>
          </SnapListItem>
        ))}
      </List>
    </>
  )
}

const Header = styled.div`
  align-items: center;
  display: flex;
  margin: 1rem 0 0.5rem 0;
  & > .header-btn {
    align-items: center;
    background: transparent;
    border: 0;
    cursor: pointer;
    display: flex;
    margin: 0;
    padding: 0;
  }
  & > .inspect-btn {
    margin-left: 1rem;
  }
  .hidden {
    display: none;
    visibility: hidden;
  }
`
const Title = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  margin: 0 0 0 0.5rem;
  text-transform: uppercase;
`
const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  max-height: 300px;
  overflow-y: scroll;
  padding: 0;
  &.hidden {
    display: none;
    visibility: hidden;
  }
  & > li:nth-child(odd) {
    background: #f3f3f3;
  }
`
const SnapListItem = styled.li`
  border-radius: 2px;
  padding: 0.25rem;
`
const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  & > h4 {
    margin: 0;
    margin-right: 1rem;
  }
`
const Buttons = styled.div`
  display: flex;
  margin: 0.25rem 0;
  button + button {
    margin-left: 0.5rem;
  }
`
const IconButtons = styled.div`
  display: flex;
  margin: 0.25rem 0;
  button + button {
    margin-left: 0.5rem;
  }
`
const Button = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
  &:hover {
    opacity: 0.7;
  }
`
