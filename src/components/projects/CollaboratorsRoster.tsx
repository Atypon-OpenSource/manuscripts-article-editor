import { UserProfile } from '@manuscripts/transform'
import React, { useCallback, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import styled from 'styled-components'
import { selectedSuggestionKey } from '@manuscripts/body-editor'

export const CollaboratorsRoster: React.FC = () => {
  const [{ collaboratorsById, user, trackState, editor }] = useStore(
    (state) => {
      return {
        trackState: state.trackState,
        user: state.user,
        collaboratorsById: state.collaboratorsById,
        permittedActions: state.permittedActions,
        isViewingMode: state.isViewingMode,
        editor: state.editor,
      }
    }
  )

  const onUserClick = useCallback((userID: string) => {
    const state = editor.state
    const view = editor.view
    const tr = state.tr
    tr.setMeta(selectedSuggestionKey, userID)
    view?.dispatch(tr)
  }, [])

  const usersWithChanges = useMemo(() => {
    const users = new Map<string, UserProfile>()
    trackState?.changeSet.pending.map((change) => {
      users.set(
        change.dataTracked.authorID,
        collaboratorsById.get(change.dataTracked.authorID)
      )
    })
    return [...users.values()]
  }, [trackState])
  /**
   * TODO:
   * 1. Get a set of users with pending changes
   * 2. Expose a method from a decorative plugin to highlight changes of that give user
   */

  return (
    <div>
      <UsersList>
        {usersWithChanges.map((u) => (
          <li key={u.id}>
            <button onClick={() => onUserClick(u.id)}>
              <UserIcon>
                {u.given ? u.given[0] + '.' : 'A'}
                {u.family ? u.family[0] : 'A'}
              </UserIcon>
            </button>
          </li>
        ))}
      </UsersList>
    </div>
  )
}

const UserIcon = styled.button`
  height: 24px;
  width: 24px;
  border-radius: 12px;
  position: relative;
  text-transform: uppercase;
  line-height: 1;
  background: #c9c9c9;
  border: 2px solid #fff;
`

const UsersList = styled.ul`
  display: inline-flex;
`
