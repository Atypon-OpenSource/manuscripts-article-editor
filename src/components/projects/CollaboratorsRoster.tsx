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
import { selectedSuggestionKey } from '@manuscripts/body-editor'
import { Project, UserProfile } from '@manuscripts/transform'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'

import { useStore } from '../../store/useStore'
import { getUserRole } from '../../lib/roles'
import {
  activeSelection,
  CollaboratorsDropdownRoster,
  UserIcon,
} from './CollaboratorsDropdownRoster'

export const CollaboratorsRoster: React.FC = () => {
  const [{ collaboratorsById, trackState, editor, isActive, project }] =
    useStore((state) => {
      return {
        trackState: state.trackState,
        collaboratorsById: state.collaboratorsById,
        permittedActions: state.permittedActions,
        isViewingMode: state.isViewingMode,
        editor: state.editor,
        isActive: state.isTrackingChangesVisible,
        project: state.project,
      }
    })

  const highlightedAuthorId = useMemo(() => {
    if (editor && editor.state) {
      return selectedSuggestionKey.getState(editor.state)?.highlightedAuthorId
    }
  }, [editor])

  const usersDict = useMemo(() => {
    const users = new Map<string, UserProfile>()
    trackState?.changeSet.pending.forEach((change) => {
      if (collaboratorsById.has(change.dataTracked.authorID)) {
        const author = collaboratorsById.get(change.dataTracked.authorID)
        users.set(change.dataTracked.authorID, author!)
      }
    })
    return users
  }, [collaboratorsById, trackState])

  const maxInMainRoster = 3
  const [roster, setRoster] = useState<UserProfile[]>([])

  useEffect(() => {
    const users = roster.length ? [...roster] : [...usersDict.values()]
    const highlightedAuthor = highlightedAuthorId
      ? usersDict.get(highlightedAuthorId)
      : undefined
    let pos = maxInMainRoster - 1

    if (highlightedAuthor && users.indexOf(highlightedAuthor) > pos) {
      // offsetting items when the selected user is in the dropdown has to move into the main roster to provide nicer UX
      // insted of just swapping with the last in the main roster and making the rest look stale
      while (users.indexOf(highlightedAuthor) != pos) {
        const current = users.indexOf(highlightedAuthor)
        const swap = current == users.length - 1 ? 0 : current + 1
        ;[users[current], users[swap]] = [users[swap], users[current]]
      }
    }
    setRoster(users)
  }, [trackState, highlightedAuthorId, usersDict])

  const onUserClick = useCallback(
    (userID: string) => {
      if (!isActive) {
        return
      }
      const state = editor.state
      const view = editor.view
      const tr = state.tr
      tr.setMeta(
        selectedSuggestionKey,
        highlightedAuthorId === userID ? '' : userID
      ) // toggle if clicked on selected author
      view?.dispatch(tr)
    },
    [editor, highlightedAuthorId, isActive]
  )

  if (!editor || !editor.view) {
    return null
  }

  const mainRoster = roster.slice(0, maxInMainRoster)
  const restRoster = roster.slice(maxInMainRoster)

  return (
    <UsersList className={!isActive ? 'inactive' : undefined}>
      {mainRoster.map(
        (u, i) =>
          u &&
          u._id && (
            <UserIcon
              style={{ zIndex: highlightedAuthorId === u._id ? i + 2 : 1 }}
              aria-label={`${highlightedAuthorId === u._id ? 'Hide' : 'Show'} changes made by ${GetName(u, project, true) + ' ' + GetSurname(u, collaboratorsById, true)}`}
              type="button"
              data-tooltip-content={
                GetName(u, project, true) +
                ' ' +
                GetSurname(u, collaboratorsById, true)
              }
              className={
                highlightedAuthorId === u._id ? activeSelection : undefined
              }
              key={u._id}
              aria-pressed={highlightedAuthorId === u._id}
              onClick={() => onUserClick(u._id)}
            >
              {GetName(u, project)}
              {GetSurname(u, collaboratorsById)}
            </UserIcon>
          )
      )}
      <CollaboratorsDropdownRoster
        collaboratorsById={collaboratorsById}
        roster={restRoster}
        onUserClick={onUserClick}
        project={project}
      />
    </UsersList>
  )
}

/*
  In regard to ts-ignore here: The UserProfile type lacks bibliographicName property which is actually there.
  I'm not fixing the type as we plan to move away from using name and surname coming from
  manuscripts api anyway and there is no point in introducing it into the codebase
  since it's already naturally and conveniently absent.
*/


const UsersList = styled.div`
  &.inactive {
    pointer-events: none;
  }
  &.inactive ${UserIcon} {
    background: #fff;
    border: 1px solid transparent;
    box-shadow: 0 0 0 2px #e1e1e1;
    color: #b4b4b4;
  }

  padding: 0 0 0 8px;
  border-left: 1px solid #e2e2e2;
  margin: 0;
  display: inline-flex;
`
