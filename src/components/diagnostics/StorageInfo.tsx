/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import prettyBytes from 'pretty-bytes'
import React, { useEffect, useState } from 'react'
import { styled } from '../../theme/styled-components'

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
  padding: 8px 20px;
`
