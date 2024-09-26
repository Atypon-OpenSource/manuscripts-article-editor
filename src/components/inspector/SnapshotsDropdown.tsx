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
import { Avatar, SecondaryButton, useDropdown } from '@manuscripts/style-guide'
import {
  trackChangesPluginKey,
  TrackChangesStatus,
  trackCommands,
} from '@manuscripts/track-changes-plugin'
import { EditorState } from 'prosemirror-state'
import React from 'react'
import styled from 'styled-components'

import useExecCmd from '../../hooks/use-exec-cmd'
import { get } from '../../quarterback/api/methods'
import { IGetSnapshotResponse, SnapshotLabel } from '../../quarterback/types'
import { useStore } from '../../store'
import { FormattedDateTime } from '../FormattedDateTime'
import {
  Dropdown,
  DropdownButtonContainer,
  DropdownContainer,
  DropdownToggle,
} from '../nav/Dropdown'

export const SnapshotsDropdown: React.FC = () => {
  const { wrapperRef, toggleOpen, isOpen } = useDropdown()
  const [
    {
      view,
      doc,
      originalPmDoc,
      authToken,
      snapshotsMap,
      snapshots,
      inspectedSnapshotId,
    },
    dispatch,
  ] = useStore((store) => ({
    view: store.view,
    doc: store.doc,
    originalPmDoc: store.originalPmDoc,
    authToken: store.authToken,
    snapshotsMap: store.snapshotsMap,
    snapshots: store.snapshots,
    inspectedSnapshotId: store.inspectedSnapshotId,
  }))

  const execCmd = useExecCmd()

  if (!view) {
    return null
  }

  const sortedSnapshots = snapshots.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const isBeingInspected = (snap: SnapshotLabel) =>
    inspectedSnapshotId === snap.id

  const hydrateDocFromJSON = (doc: Record<string, any>) => {
    const state = EditorState.create({
      doc: view.state.schema.nodeFromJSON(doc),
      plugins: view.state.plugins,
    })
    view && view.updateState(state)
    const trackState = view
      ? trackChangesPluginKey.getState(view.state)
      : undefined
    dispatch({ trackState })
  }

  const inspectSnapshot = async (id: string) => {
    const inspected = snapshotsMap.get(id)

    if (inspected) {
      dispatch({ inspectedSnapshotId: id })
      return { data: inspected }
    }

    const resp = await get<IGetSnapshotResponse>(`snapshot/${id}`, authToken)
    if ('data' in resp) {
      dispatch({
        snapshotsMap: snapshotsMap.set(id, resp.data),
        inspectedSnapshotId: resp.data.id,
      })
      return resp
    }
  }

  async function handleInspectSnapshot(snap: SnapshotLabel) {
    if (!inspectedSnapshotId) {
      dispatch({
        originalPmDoc: doc.toJSON(),
      })
    } else if (isBeingInspected(snap)) {
      handleResumeEditing()
      return
    }

    const resp = await inspectSnapshot(snap.id)
    if (resp) {
      hydrateDocFromJSON(resp.data.snapshot as Record<string, any>)
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.viewSnapshots))
    }
  }
  function handleResumeEditing() {
    dispatch({
      inspectedSnapshotId: null,
    })

    if (originalPmDoc) {
      hydrateDocFromJSON(originalPmDoc)
    }
    execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.enabled))
  }

  const inspectedSnapshot = snapshotsMap.get(inspectedSnapshotId)

  return (
    <SnapshotContainer>
      <DropdownContainer id={'snapshots-dropdown'} ref={wrapperRef}>
        <DropdownButtonContainer
          onClick={toggleOpen}
          isOpen={isOpen}
          className={'dropdown-toggle'}
        >
          <Container>
            <AvatarContainer>
              <Avatar size={20} />
            </AvatarContainer>
            <InnerContainer>
              <Text>
                {inspectedSnapshot ? inspectedSnapshot.name : 'Current'}
                <DropdownToggle className={isOpen ? 'open' : ''} />
              </Text>
              {inspectedSnapshot && (
                <DateTime>
                  <FormattedDateTime
                    date={Math.floor(
                      new Date(inspectedSnapshot.createdAt).getTime() / 1000
                    )}
                  />{' '}
                </DateTime>
              )}
            </InnerContainer>
          </Container>
        </DropdownButtonContainer>
        {isOpen && (
          <SnapshotsList top={25} direction={'left'} minWidth={100}>
            <Element
              onClick={(e) => {
                if (inspectedSnapshot) {
                  handleResumeEditing()
                }
                toggleOpen()
              }}
              key={'current'}
            >
              <Container>
                <AvatarContainer>
                  <Avatar size={20} />
                </AvatarContainer>
                <InnerContainer>
                  <Text>{'Current'}</Text>
                </InnerContainer>
              </Container>
            </Element>
            {sortedSnapshots.map((snapshot) => {
              return (
                <Element
                  onClick={(e) => {
                    handleInspectSnapshot(snapshot)
                    toggleOpen()
                  }}
                  key={snapshot.id}
                >
                  <Container>
                    <AvatarContainer>
                      <Avatar size={20} />
                    </AvatarContainer>
                    <InnerContainer>
                      <Text>{snapshot.name}</Text>

                      <DateTime>
                        <FormattedDateTime
                          date={Math.floor(
                            new Date(snapshot.createdAt).getTime() / 1000
                          )}
                        />{' '}
                      </DateTime>
                    </InnerContainer>
                  </Container>
                </Element>
              )
            })}
          </SnapshotsList>
        )}
      </DropdownContainer>
    </SnapshotContainer>
  )
}
const Container = styled.div`
  display: flex;
`
const InnerContainer = styled.div`
  display: block;
  text-align: left;
  margin-left: 8px;
`
const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${(props) => props.theme.grid.unit}px;
`
const SnapshotsList = styled(Dropdown)`
  display: block;
  overflow: auto;
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`
const Element = styled(SecondaryButton)`
  background: ${(props) => props.theme.colors.background.primary} !important;
  display: inline-block;
  width: 100%;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 6}px;
  white-space: nowrap;
  border: none;
  &:not([disabled]):hover {
    background: ${(props) => props.theme.colors.background.fifth} !important;
  }
`
const SnapshotContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
  margin-top: ${(props) => props.theme.grid.unit * 6}px;
  align-items: center;

  .dropdown-toggle {
    border: none;
    background: transparent !important;
  }

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`
const Text = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.normal};
  display: flex;
  align-items: center;
`
const DateTime = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`
