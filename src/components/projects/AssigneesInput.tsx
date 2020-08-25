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
import { Section, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { Avatar, Tip } from '@manuscripts/style-guide'
import React, { useState } from 'react'
import Select, { components } from 'react-select'
import styled from 'styled-components'
import { avatarURL } from '../../lib/avatar-url'
import { selectStyles } from '../../lib/select-styles'
import { AnyElement } from '../inspector/ElementStyleInspector'
import { SaveModel } from './ManuscriptInspector'
import { PlusIcon } from './Status/StatusIcons'

const Name = styled.div`
  padding-left: ${props => props.theme.grid.unit}px;
`
const AvatarContainer = styled.div`
  margin-right: ${props => props.theme.grid.unit}px;
`
const Avatars = styled.div`
  display: flex;
  margin-left: ${props => props.theme.grid.unit * 2}px;
`
const Button = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

interface Props {
  data: UserProfile
}
const MultiValueLabel: React.FC<Props> = props => {
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
  saveModel: SaveModel
  target: AnyElement | Section
}> = ({ saveModel, profiles, target }) => {
  const userIDs = target.assignees || []

  const assignees = profiles.filter(profile => userIDs.includes(profile._id))
  const [opened, setOpened] = useState(false)

  return !opened ? (
    <>
      {assignees.length !== 0 && (
        <Avatars>
          {assignees.map(user => (
            <AvatarContainer key={user._id}>
              <Tip
                placement={'bottom'}
                title={
                  user.bibliographicName.given +
                  ' ' +
                  user.bibliographicName.family
                }
              >
                <Avatar src={avatarURL(user)} size={22} />
              </Tip>
            </AvatarContainer>
          ))}
        </Avatars>
      )}
      <Button onClick={() => setOpened(!opened)}>
        <Tip placement={'bottom'} title={'Add or remove assignees'}>
          <PlusIcon />
        </Tip>
      </Button>
    </>
  ) : (
    <Select<UserProfile>
      isMulti={true}
      options={profiles}
      value={assignees}
      getOptionValue={option => option._id}
      getOptionLabel={option =>
        option.bibliographicName.given + ' ' + option.bibliographicName.family
      }
      onChange={async (users: UserProfile[]) => {
        await saveModel<AnyElement | Section>({
          ...target,
          assignees: users ? users.map(user => user._id) : [],
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
        }),
        multiValue: base => ({
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
      }}
      menuPortalTarget={document.body}
      onBlur={() => setOpened(!opened)}
      autoFocus={true}
      noOptionsMessage={() => null}
      components={{ MultiValueLabel }}
    />
  )
}
