/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import {
  Manuscript,
  Section,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Avatar } from '@manuscripts/style-guide'
import React, { useState } from 'react'
import Select, { components } from 'react-select'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import { avatarURL } from '../../lib/avatar-url'
import { selectStyles } from '../../lib/select-styles'
import { useStore } from '../../store'
import { AnyElement } from '../inspector/ElementStyleInspector'
import { CloseIcon, PlusIcon } from './Status/StatusIcons'

const Name = styled.div`
  padding-left: ${(props) => props.theme.grid.unit}px;
`
const AvatarContainer = styled.div`
  margin-right: ${(props) => props.theme.grid.unit}px;
  position: relative;

  .tooltip {
    border-radius: 6px;
  }

  & img {
    border: 1px solid transparent;
  }

  &:hover {
    & img {
      border: 1px solid #bce7f6;
    }

    .remove {
      cursor: pointer;

      svg {
        fill: #6e6e6e;
      }
    }
  }
`
const Avatars = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`
const Button = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  .tooltip {
    border-radius: 6px;
  }

  &:focus {
    outline: none;
  }
`
const RemoveContainer = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  height: 10px;
  width: 10px;
  display: flex !important;
  align-items: center;
  justify-content: center;

  svg {
    fill: none;
  }
`
interface Props {
  data: UserProfile
}
const MultiValueLabel: React.FC<Props> = (props) => {
  return (
    <components.MultiValueLabel {...props}>
      <Avatar src={avatarURL(props.data)} size={22} />
      <Name>
        {props.data.bibliographicName.given +
          ' ' +
          props.data.bibliographicName.family}
      </Name>
    </components.MultiValueLabel>
  )
}

export const AssigneesInput: React.FC<{
  profiles: UserProfile[]
  target: AnyElement | Section | Manuscript
}> = ({ profiles, target }) => {
  const userIDs = target.assignees || []
  const [saveModel] = useStore((store) => store.saveModel)
  const assignees = profiles.filter((profile) => userIDs.includes(profile._id))
  const [opened, setOpened] = useState(false)

  return !opened ? (
    <>
      {assignees.length !== 0 && (
        <Avatars>
          {assignees.map((user) => (
            <AvatarContainer key={user._id}>
              <div data-tip={true} data-for={user._id}>
                <Avatar src={avatarURL(user)} size={22} />
              </div>
              <ReactTooltip
                id={user._id}
                place="bottom"
                effect="solid"
                offset={{ top: 4 }}
                className="tooltip"
              >
                {user.bibliographicName.given +
                  ' ' +
                  user.bibliographicName.family}
              </ReactTooltip>
              <RemoveContainer
                onClick={async () =>
                  await saveModel<AnyElement | Section | Manuscript>({
                    ...target,
                    assignees: target.assignees!.filter(
                      (assignee) => assignee !== user._id
                    ),
                  })
                }
                className="remove"
              >
                <CloseIcon />{' '}
              </RemoveContainer>
            </AvatarContainer>
          ))}
        </Avatars>
      )}
      <Button onClick={() => setOpened(!opened)}>
        <div data-tip={true} data-for="addAssigneeTip">
          <PlusIcon />
        </div>
        <ReactTooltip
          id="addAssigneeTip"
          place="bottom"
          effect="solid"
          offset={{ top: 4 }}
          className="tooltip"
        >
          Add or remove assignees
        </ReactTooltip>
      </Button>
    </>
  ) : (
    <Select<UserProfile, true>
      options={profiles}
      value={assignees}
      getOptionValue={(option) => option._id}
      getOptionLabel={(option) =>
        option.bibliographicName.given + ' ' + option.bibliographicName.family
      }
      onChange={async (users: UserProfile[]) => {
        await saveModel<AnyElement | Section | Manuscript>({
          ...target,
          assignees: users ? users.map((user) => user._id) : [],
        })
      }}
      styles={{
        ...selectStyles,
        multiValueLabel: () => ({
          backgroundColor: 'none',
          color: 'black',
          paddingRight: 2,
          alignItems: 'center',
          display: 'flex',
          wordBreak: 'break-word',
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: 'none',
          color: 'black',
          alignItems: 'center',
          paddingRight: 4,
        }),
        multiValueRemove: () => ({
          backgroundColor: '#6e6e6e',
          color: '#fff',
          borderRadius: '50%',
          height: 14,
          width: 14,
          cursor: 'pointer',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? '#F2FBFC' : 'transparent',
          '&:hover': {
            backgroundColor: '#F2FBFC',
          },
        }),
      }}
      menuPortalTarget={document.body}
      onBlur={() => setOpened(!opened)}
      autoFocus={true}
      noOptionsMessage={() => null}
      components={{ MultiValueLabel }}
    />
  )
}
