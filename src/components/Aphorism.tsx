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
import { styled } from '../theme/styled-components'
// import { Aphorism } from '@manuscripts/manuscripts-json-schema'

export interface Aphorism {
  body: string
  credit: string
}

export const AphorismView: React.FC<{
  aphorism: Aphorism
}> = ({ aphorism }) => (
  <AphorismContainer>
    <AphorismBody>{aphorism.body}</AphorismBody>
    <AphorismCredit>{aphorism.credit}</AphorismCredit>
  </AphorismContainer>
)

const AphorismContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  text-align: center;
  margin-top: 24px;
`

const AphorismBody = styled.div`
  font-size: 140%;
  font-style: italic;
  margin: 16px;
  color: #444;
`

const AphorismCredit = styled.div`
  color: #777;
`
