/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import prettyBytes from 'pretty-bytes'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

export const StorageInfo: React.FC = () => {
  const [estimate, setEstimate] = useState<StorageEstimate>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage
        .estimate()
        .then(estimate => {
          setEstimate(estimate)
        })
        .catch(error => {
          setError(error)
        })
    }
  })

  if (error) {
    return (
      <Container>
        {error.name}: {error.message}
      </Container>
    )
  }

  if (
    estimate === undefined ||
    estimate.quota === undefined ||
    estimate.usage === undefined
  ) {
    return null
  }

  return (
    <Container>
      {prettyBytes(estimate.quota - estimate.usage)} of local storage is
      available
    </Container>
  )
}

const Container = styled.div`
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 5}px;
`
