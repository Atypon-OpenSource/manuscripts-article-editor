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

import React from 'react'
import config from '../config'
import { createToken, createUserProfile } from '../lib/developer'
import { styled } from '../theme/styled-components'
import { DatabaseContext } from './DatabaseProvider'

const DropdownAction = styled.div`
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #7fb5d5;
    color: white;
  }
`

const DropdownInfo = styled.div`
  padding: 10px 20px;
  white-space: nowrap;
`

const PlainLink = styled.a`
  color: inherit;
  text-decoration: none;
`

const DeveloperPageContainer: React.FunctionComponent = () => (
  <DatabaseContext.Consumer>
    {db => (
      <div>
        <DropdownAction
          onClick={() => {
            createToken()
            alert('Created token')
          }}
        >
          Create token
        </DropdownAction>

        <DropdownAction
          onClick={async () => {
            await createUserProfile(db)
            alert('Created user profile')
            window.location.href = '/'
          }}
        >
          Create user profile
        </DropdownAction>

        <DropdownAction
          onClick={async () => {
            await db.remove()
            alert('Removed database')
            window.location.href = '/'
          }}
        >
          Delete database
        </DropdownAction>

        {config.git.version && (
          <DropdownInfo>Version: {config.git.version}</DropdownInfo>
        )}

        {config.git.commit && (
          <DropdownInfo>Commit: {config.git.commit}</DropdownInfo>
        )}

        <DropdownInfo>
          <PlainLink href={`${config.api.url}/app/version`}>
            API version
          </PlainLink>
        </DropdownInfo>
      </div>
    )}
  </DatabaseContext.Consumer>
)

export default DeveloperPageContainer
