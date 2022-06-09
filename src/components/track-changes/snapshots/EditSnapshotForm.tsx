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
import { Evt, SnapshotLabel } from '@manuscripts/quarterback-types'
import React, { useState } from 'react'
import styled from 'styled-components'

export interface UpdateSnapshotFormValues {
  name: string
}
interface IProps {
  className?: string
  snapshot: SnapshotLabel
  onSubmit(
    formValues: UpdateSnapshotFormValues
  ): AsyncGenerator<Evt<boolean>, void, unknown>
  onCancel(snapshotId: string): void
}

export const EditSnapshotForm = (props: IProps) => {
  const { className = '', snapshot, onSubmit, onCancel } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editedName, setEditedName] = useState(snapshot.name)

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    const values = {
      name: editedName,
    }
    setLoading(true)
    for await (const evt of onSubmit(values)) {
      switch (evt.e) {
        case 'ok':
          setError('')
          onCancel(snapshot.id)
          break
        case 'error':
          setError(evt.error)
          break
        case 'finally':
          setLoading(false)
          break
      }
    }
  }
  function handleEditCancel() {
    onCancel(snapshot.id)
  }
  return (
    <EditForm className={className} onSubmit={handleSubmit}>
      <input
        value={editedName}
        required
        onChange={(e) => setEditedName(e.target.value)}
      />
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <button type="submit" disabled={loading}>
        Save
      </button>
      <button type="button" disabled={loading} onClick={handleEditCancel}>
        Cancel
      </button>
    </EditForm>
  )
}

const EditForm = styled.form`
  margin: 0;
  input {
    margin: 0 0.5rem 0 0;
    width: 10rem;
  }
  button {
    cursor: pointer;
  }
  button + button {
    margin-left: 0.5rem;
  }
`
const ErrorMsg = styled.small`
  color: red;
`
