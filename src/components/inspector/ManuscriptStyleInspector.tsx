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
