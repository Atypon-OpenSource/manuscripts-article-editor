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

import { Bundle, Manuscript } from '@manuscripts/manuscripts-json-schema'
import { MiniButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import {
  InspectorField,
  InspectorLabel,
  InspectorSection,
  InspectorValue,
} from '../InspectorSection'

interface Props {
  bundle?: Bundle
  manuscript: Manuscript
  openCitationStyleSelector: () => void
}

const CitationStyle = styled.input.attrs({ readOnly: true })`
  font-size: 14px;
  font-family: Barlow, sans-serif;
  padding: 2px 60px 2px 13px;
  display: flex;
  flex: 1;
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const ManuscriptInspector: React.FC<Props> = ({
  bundle,
  manuscript,
  openCitationStyleSelector,
}) => (
  <InspectorSection title={'Manuscript'}>
    <InspectorField>
      <InspectorLabel>Citation Style</InspectorLabel>
      <InspectorValue onClick={openCitationStyleSelector}>
        <CitationStyle value={bundle ? bundle.csl!.title : ''} />
        <MiniButton>Choose</MiniButton>
      </InspectorValue>
    </InspectorField>
  </InspectorSection>
)
