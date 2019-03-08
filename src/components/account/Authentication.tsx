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

import { GoogleIcon, IconButton, OrcidIcon } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { AuthProvider } from './AuthButtonContainer'

export interface AuthenticationButtonProps {
  redirect: (provider: AuthProvider) => () => void
}

export const GoogleLogin: React.FunctionComponent<
  AuthenticationButtonProps
> = ({ redirect }) => (
  <IconButton type={'button'} onClick={redirect('google')}>
    <GoogleIcon size={48} />
  </IconButton>
)

export const OrcidLogin: React.FunctionComponent<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <IconButton type={'button'} onClick={redirect('orcid')}>
    <OrcidIcon size={48} />
  </IconButton>
)

export const AuthenticationContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
`
