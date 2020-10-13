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

import React from 'react'
import styled from 'styled-components'

import config from '../config'
import { createToken, createUserProfile } from '../lib/developer'
import { DatabaseContext } from './DatabaseProvider'
import { StorageInfo } from './diagnostics/StorageInfo'

const DropdownAction = styled.div`
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
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
    {(db) => (
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
            window.location.assign('/projects')
          }}
        >
          Create user profile
        </DropdownAction>

        <DropdownAction
          onClick={async () => {
            await db.remove()
            alert('Removed database')
            window.location.assign('/projects')
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

        <StorageInfo />
      </div>
    )}
  </DatabaseContext.Consumer>
)

export default DeveloperPageContainer
