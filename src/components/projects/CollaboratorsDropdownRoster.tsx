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
import { useDropdown } from '@manuscripts/style-guide'
import { Project, UserProfile } from '@manuscripts/transform'
import React, { useRef } from 'react'
import styled from 'styled-components'

import { Dropdown } from '../nav/Dropdown'
import { GetName, GetSurname } from './CollaboratorsRoster'

export const CollaboratorsDropdownRoster: React.FC<{
  roster: UserProfile[]
  project: Project
  onUserClick: (id: string) => void
  collaboratorsById: Map<string, UserProfile>
}> = ({ roster, project, onUserClick, collaboratorsById }) => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()
  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  return (
    <RosterContainer ref={wrapperRef}>
      <DropdownButtonContainer
        ref={toggleButtonRef}
        isOpen={isOpen}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            toggleOpen()
          }
        }}
        className={'dropdown-toggle'}
        tabIndex={0}
      >
        +{roster.length}
      </DropdownButtonContainer>
      {isOpen && (
        <Dropdown minWidth={100}>
          <RosterDropdown>
            {roster.map(
              (u, i) =>
                u &&
                u._id && (
                  <DropdownItem
                    type="button"
                    key={u._id}
                    onClick={() => onUserClick(u._id)}
                    aria-label={`Show changes made by ${GetName(u, project, true) + ' ' + GetSurname(u, collaboratorsById, true)}`}
                  >
                    <UserIconDisplay>
                      {GetName(u, project)}
                      {GetSurname(u, collaboratorsById)}
                    </UserIconDisplay>
                    <span>
                      {GetName(u, project, true)}{' '}
                      {GetSurname(u, collaboratorsById, true)}
                    </span>
                  </DropdownItem>
                )
            )}
          </RosterDropdown>
        </Dropdown>
      )}
    </RosterContainer>
  )
}

export const activeSelection = 'active-selection'

const RosterContainer = styled.div`
  position: relative;
`
const RosterDropdown = styled.div`
  padding: 10px;
`

export const UserIcon = styled.button`
  cursor: pointer;
  height: 24px;
  width: 24px;
  border-radius: 12px;
  position: relative;
  font-family: inherit;
  padding: 0;
  display: inline-block;
  text-transform: uppercase;
  line-height: 2.3;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  background: #c9c9c9;
  color: #353535;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #fff;
  z-index: 1;
  & + button {
    margin-left: -5px;
  }
  &.${activeSelection} {
    box-shadow: 0 0 0 2px #0d79d0;
  }
`
const UserIconDisplay = UserIcon.withComponent('span')

const DropdownItem = styled.button`
  cursor: pointer;
  white-space: nowrap;
  background: transparent;
  padding: 0;
  font-family: inherit;
  border: none;
  line-height: 1;
  font-size: 14px;
  font-weight: 400;
  display: inline-flex;
  align-items: center;

  & ${UserIconDisplay} {
    margin-right: 6px;
  }
`

const DropdownButtonContainer = styled(UserIcon).attrs(
  (props: { isOpen: boolean }) => ({
    selected: props.isOpen,
  })
)<{ isOpen: boolean }>`
  background: #f2f2f2;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #fff;
  margin-left: -5px;
  z-index: 0;
`
