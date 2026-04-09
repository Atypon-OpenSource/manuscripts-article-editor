import { Project, UserProfile } from '@manuscripts/transform'
import React, { useCallback, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import styled from 'styled-components'
import { selectedSuggestionKey } from '@manuscripts/body-editor'
import { getUserRole } from '../../lib/roles'

const activeSelection = 'active-selection'

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

  const usersWithChanges = useMemo(() => {
    const users = new Map<string, UserProfile>()
    trackState?.changeSet.pending.forEach((change) => {
      if (collaboratorsById.has(change.dataTracked.authorID)) {
        users.set(
          change.dataTracked.authorID,
          collaboratorsById.get(change.dataTracked.authorID)!
        )
      }
    })
    return [...users.values()]
  }, [trackState])

  if (!editor || !editor.view) {
    return null
  }

  return (
    <UsersList className={!isActive ? 'inactive' : undefined}>
      {usersWithChanges.map(
        (u, i) =>
          u &&
          u._id && (
            <UserIcon
              style={{ zIndex: highlightedAuthorId === u._id ? i + 1 : 0 }}
              aria-label={`${highlightedAuthorId === u._id ? 'Hide' : 'Show'} changes made by ${GetName(u, project, true) + ' ' + GetSurname(u, i, true)}`}
              type="button"
              data-tooltip-content={
                GetName(u, project, true) + ' ' + GetSurname(u, i, true)
              }
              className={
                highlightedAuthorId === u._id ? activeSelection : undefined
              }
              key={u._id}
              aria-pressed={highlightedAuthorId === u._id}
              onClick={() => onUserClick(u._id)}
            >
              {GetName(u, project)}
              {GetSurname(u, i)}
            </UserIcon>
          )
      )}
    </UsersList>
  )
}

/*
  In regard to ts-ignore here: The UserProfile type lack bibliographicName property which is actually there.
  I'm not fixing the type as we plan to move away from using name and surname coming from
  manuscripts api anyway and there is no point in introducing it into the codebase
  since it's already naturally and conveniently absent.
*/
function GetName(user: UserProfile, project: Project, full = false) {
  // @ts-ignore
  const name = user.bibliographicName?.given as string

  if (!name) {
    return getUserRole(project, user.userID)
  }
  return full ? name : name[0]
}
function GetSurname(user: UserProfile, i: number, full = false) {
  // @ts-ignore
  const familyName = user.bibliographicName?.family as string
  return familyName ? (full ? familyName : familyName[0]) : i
}

const UserIcon = styled.button`
  cursor: pointer;
  height: 24px;
  width: 24px;
  border-radius: 12px;
  position: relative;
  padding: 0;
  text-transform: uppercase;
  line-height: 1;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  line-height: 0.9;
  background: #c9c9c9;
  color: #353535;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #fff;
  & + button {
    margin-left: -5px;
  }
  &.${activeSelection} {
    box-shadow: 0 0 0 2px #0d79d0;
  }
`

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

  list-style: none;
  padding: 0 0 0 8px;
  border-left: 1px solid #e2e2e2;
  margin: 0;
  display: inline-flex;
`
