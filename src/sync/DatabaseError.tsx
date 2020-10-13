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

import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { StorageInfo } from '../components/diagnostics/StorageInfo'
import { logout } from '../lib/account'

export const DatabaseError: React.FC = () => {
  return (
    <Dialog
      isOpen={true}
      category={Category.error}
      header={'Database error'}
      message={
        <div>
          <p>
            Manuscripts is failing to open a local database in your browser to
            store your project data.
          </p>

          <p>
            Some browsers do not allow access to this local database in private
            browsing mode. Are you in private browsing mode?
          </p>

          <Diagnostics open={true}>
            <summary>Diagnostics</summary>
            <StorageInfo />
          </Diagnostics>
        </div>
      }
      actions={{
        primary: {
          title: 'Sign out and try again',
          action: logout,
        },
      }}
    />
  )
}

const Diagnostics = styled.details`
  margin: ${(props) => props.theme.grid.unit * 4}px 0;
`
