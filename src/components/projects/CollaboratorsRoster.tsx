import { UserProfile } from '@manuscripts/transform'
import React, { useMemo } from 'react'
import { useStore } from '../../store/useStore'
import styled from 'styled-components'

export const CollaboratorsRoster: React.FC = () => {
  const [{ collaboratorsById, user, trackState }] = useStore((state) => {
    return {
      trackState: state.trackState,
      user: state.user,
      collaboratorsById: state.collaboratorsById,
      permittedActions: state.permittedActions,
      isViewingMode: state.isViewingMode,
    }
  })

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
            <UserIcon>
              {u.given ? u.given[0] + '.' : ''}
              {u.family[0]}
            </UserIcon>
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
`

const UsersList = styled.ul`
  display: inline-flex;
`
