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
import React, { useState } from 'react'
import styled from 'styled-components'

export interface TrackUser {
  id: string
  name: string
  color: string
}
export interface TrackOptions {
  disableTrack: boolean
  debug: boolean
  user: TrackUser
  documentId: string
}

interface Props {
  options: TrackOptions
  setUser?: (type: 'new' | 'logged', cb: (user: TrackUser) => void) => void
  setOptions: React.Dispatch<React.SetStateAction<TrackOptions>>
}

export function TrackOptions(props: Props) {
  const { options, setOptions, setUser } = props
  const [debounce, setDebounce] = useState<ReturnType<typeof setTimeout>>()
  const [userId, setUserId] = useState(options.user.id)
  const [userName, setUserName] = useState(options.user.name)
  const [userColor, setUserColor] = useState(options.user.color)
  const [documentId, setDocumentId] = useState(options.documentId)

  function setWithDebounce(cb: () => void) {
    if (debounce) {
      clearTimeout(debounce)
    }
    setDebounce(() =>
      setTimeout(() => {
        cb()
      }, 500)
    )
  }
  function handleChange(field: keyof TrackUser | 'documentId', value: string) {
    switch (field) {
      case 'id':
        setUserId(value)
        break
      case 'name':
        setUserName(value)
        break
      case 'color':
        setUserColor(value)
        break
      case 'documentId':
        setDocumentId(value)
        break
    }
    setWithDebounce(() =>
      setOptions((opt) => {
        if (field === 'documentId') {
          return { ...opt, [field]: value }
        }
        return { ...opt, user: { ...opt.user, [field]: value } }
      })
    )
  }
  function handleNewUser() {
    setUser!('new', (user) => {
      setUserId(user.id)
      setUserName(user.name)
      setUserColor(user.color)
      setOptions((opt) => ({ ...opt, user }))
    })
  }
  function handleUseLoggedUser() {
    setUser!('logged', (user) => {
      setUserId(user.id)
      setUserName(user.name)
      setUserColor(user.color)
      setOptions((opt) => ({ ...opt, user }))
    })
  }
  return (
    <fieldset>
      <legend>Options</legend>
      <Container>
        <Field className="row">
          <Field>
            <label htmlFor="userName">User name</label>
            <input
              id="userName"
              value={userName}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Field>
          <Field>
            <label htmlFor="userId">User id</label>
            <input
              id="userId"
              value={userId}
              onChange={(e) => handleChange('id', e.target.value)}
            />
          </Field>
          <Field>
            <label htmlFor="userColor">User color</label>
            <input
              id="userColor"
              value={userColor}
              onChange={(e) => handleChange('color', e.target.value)}
            />
          </Field>
        </Field>
        <Field className="row">
          <Button disabled={!setUser} onClick={handleNewUser}>
            Generate user
          </Button>
          <Button disabled={!setUser} onClick={handleUseLoggedUser}>
            Use logged user
          </Button>
        </Field>
        <Field>
          <label htmlFor="documentId">Document id</label>
          <input
            id="documentId"
            value={documentId}
            onChange={(e) => handleChange('documentId', e.target.value)}
          />
        </Field>
        <Field className="row">
          <button
            onClick={() =>
              setOptions((opt) => ({ ...opt, disableTrack: !opt.disableTrack }))
            }
            aria-label="toggle-track-changes"
          >
            {options.disableTrack ? 'Enable' : 'Disable'} track changes
          </button>
          <button
            onClick={() => setOptions((opt) => ({ ...opt, debug: !opt.debug }))}
            aria-label="toggle-track-debug"
          >
            {options.debug ? 'Disable' : 'Enable'} track changes debug
          </button>
        </Field>
      </Container>
    </fieldset>
  )
}

const Field = styled.div`
  display: inline-flex;
  flex-direction: column;
  &.row {
    flex-direction: row;
    & > * {
      margin-right: 1rem;
    }
  }
`
const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  & > ${Field} + ${Field} {
    margin-top: 1rem;
  }
`
const Button = styled.button`
  cursor: pointer;
  & + & {
    margin-left: 0.5rem;
  }
`
