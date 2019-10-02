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
import { SecondaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { InspectorSection } from '../InspectorSection'

const CitationStyle = styled.input.attrs({ readOnly: true })`
  font-size: ${props => props.theme.font.size.normal};
  font-family: ${props => props.theme.font.family.sans};
  padding: 2px 60px 2px 13px;
  display: flex;
  flex: 1;
  border: 1px solid #d6d6d6;
  border-radius: ${props => props.theme.grid.radius.small};
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
`

const ChooseButton = styled(SecondaryButton)`
  height: ${props => props.theme.grid.unit * 6}px
  margin-right: 0;
  position: absolute;
  right: 0;
  top: 0;
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
  padding-left: ${props => props.theme.grid.unit * 5}px
  position: relative;
  font-size: ${props => props.theme.font.size.small};
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
