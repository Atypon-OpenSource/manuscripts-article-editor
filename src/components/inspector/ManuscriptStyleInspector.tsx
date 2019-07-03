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

import { Bundle } from '@manuscripts/manuscripts-json-schema'
import { MiniButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { InspectorSection } from '../InspectorSection'

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

const ChooseButton = styled(MiniButton)`
  height: 23px;
  margin-right: 0;
  position: absolute;
  right: 0;
  top: 0;
`

export const InspectorField = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`

export const InspectorLabel = styled.div`
  flex-shrink: 0;
  width: 100px;
  color: ${props => props.theme.colors.global.text.secondary};
`

export const InspectorValue = styled.div`
  padding-left: 20px;
  position: relative;
  font-size: 90%;
  flex: 1;
  display: flex;
`

interface Props {
  bundle?: Bundle
  openCitationStyleSelector: () => void
}

export const ManuscriptStyleInspector: React.FC<Props> = ({
  bundle,
  openCitationStyleSelector,
}) => {
  return (
    <InspectorSection title={'Manuscript'}>
      <InspectorField>
        <InspectorLabel>Citation Style</InspectorLabel>
        <InspectorValue onClick={openCitationStyleSelector}>
          <CitationStyle value={bundle ? bundle.csl!.title : ''} />
          <ChooseButton>Choose</ChooseButton>
        </InspectorValue>
      </InspectorField>
    </InspectorSection>
  )
}
