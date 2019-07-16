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

import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import { StorageInfo } from '../components/diagnostics/StorageInfo'
import { logout } from '../lib/account'
import { styled } from '../theme/styled-components'

export const DatabaseError: React.FC = () => {
  return (
    <Dialog
      isOpen={true}
      category={Category.error}
      header={'Database error'}
      message={
        <div>
          <div>
            There was an unrecoverable error opening the local database.
          </div>

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
  margin: 16px 0;
`
