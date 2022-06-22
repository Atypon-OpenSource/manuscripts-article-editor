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
import {
  CHANGE_STATUS,
  ChangeSet,
  NodeChange,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import React from 'react'
import { BsQuestion } from 'react-icons/bs'
import { FiCheck, FiX } from 'react-icons/fi'
import styled from 'styled-components'

interface Props {
  parent: NodeChange
  changes: TrackedChange[]
  handleAcceptChange(c: TrackedChange): void
  handleRejectChange(c: TrackedChange): void
  handleResetChange(c: TrackedChange): void
}

export function ChildrenChangeList(props: Props) {
  const {
    changes,
    handleAcceptChange,
    handleRejectChange,
    handleResetChange,
  } = props

  function changeTitle(c: TrackedChange) {
    if (ChangeSet.isTextChange(c)) {
      return `Text ${c.attrs.operation}`
    } else if (ChangeSet.isNodeChange(c)) {
      return `${c.nodeType.charAt(0).toUpperCase()}${c.nodeType.slice(1)} ${
        c.attrs.operation
      }`
    }
    return 'Unknown change!'
  }
  return (
    <List indent>
      {changes.map((c: TrackedChange, i: number) => (
        <ListItem key={`${c.id}-${i}`} data-test="change-item">
          <MarkerBox status={c.attrs.status}>
            <span>
              {c.attrs.status === CHANGE_STATUS.accepted && (
                <FiCheck size={16} />
              )}
              {c.attrs.status === CHANGE_STATUS.rejected && <FiX size={16} />}
              {c.attrs.status === CHANGE_STATUS.pending && (
                <BsQuestion size={16} />
              )}
            </span>
          </MarkerBox>
          <Body>
            <TitleWrapper>
              <h4>{changeTitle(c)}</h4>
              <Buttons>
                {c.attrs.status !== CHANGE_STATUS.accepted && (
                  <button
                    onClick={() => handleAcceptChange(c)}
                    aria-label="accept-btn"
                  >
                    Accept
                  </button>
                )}
                {c.attrs.status !== CHANGE_STATUS.rejected && (
                  <button
                    onClick={() => handleRejectChange(c)}
                    aria-label="reject-btn"
                  >
                    Reject
                  </button>
                )}
                {c.attrs.status !== CHANGE_STATUS.pending && (
                  <button
                    onClick={() => handleResetChange(c)}
                    aria-label="reset-btn"
                  >
                    Reset
                  </button>
                )}
              </Buttons>
            </TitleWrapper>
            <Ranges>
              <span className="msg">from: {c.from}</span>
              <span className="msg">to: {c.to}</span>
            </Ranges>
          </Body>
        </ListItem>
      ))}
    </List>
  )
}

const List = styled.ul<{ indent?: boolean }>`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
  & > li + li {
    margin-top: 1rem;
  }
  &.hidden {
    display: none;
    visibility: hidden;
  }
`
const ListItem = styled.li`
  display: flex;
`
const markerBg = (status: CHANGE_STATUS) => {
  switch (status) {
    case CHANGE_STATUS.pending:
      return '#f8fb7d'
    case CHANGE_STATUS.accepted:
      return '#afffab'
    case CHANGE_STATUS.rejected:
      return '#ffabab'
  }
}
const MarkerBox = styled.div<{ status: CHANGE_STATUS }>`
  align-items: center;
  background: ${({ status }) => markerBg(status)};
  display: flex;
  margin: 0 0.5rem 0 0;
  & > * {
    padding: 0 0.5rem;
  }
`
const Body = styled.div`
  width: 100%;
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
const Ranges = styled.div`
  align-items: center;
  display: flex;
  & > .msg {
    margin-right: 1rem;
  }
`
