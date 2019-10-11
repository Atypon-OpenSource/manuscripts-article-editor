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
import { TertiaryButton, TextField } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { InspectorSection } from '../InspectorSection'

const CitationStyle = styled(TextField).attrs({ readOnly: true })`
  border-right: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  cursor: pointer;
  font-size: ${props => props.theme.font.size.normal};
  overflow: hidden;
  padding-bottom: 2px;
  padding-top: 2px;
  text-overflow: ellipsis;
`

const ChooseButton = styled(TertiaryButton)`
  border-left: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-left: 1px solid;
  border-color: ${props => props.theme.colors.border.secondary} !important;
  margin: 0;
`

export const InspectorField = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${props => props.theme.grid.unit * 4}px;
`

export const InspectorLabel = styled.div`
  flex-shrink: 0;
  width: 100px;
  color: ${props => props.theme.colors.text.secondary};
`

export const InspectorValue = styled.div`
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
          <ChooseButton mini={true}>Choose</ChooseButton>
        </InspectorValue>
      </InspectorField>
    </InspectorSection>
  )
}
