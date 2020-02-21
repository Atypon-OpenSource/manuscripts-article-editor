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

import { TextArea, TextField } from '@manuscripts/style-guide'
import { range } from 'lodash-es'
import React, { InputHTMLAttributes } from 'react'
import { styled } from '../../theme/styled-components'

export const NumberField = styled(TextField).attrs({
  type: 'number',
  min: 1,
  step: 1,
  pattern: '[0-9]+',
})`
  width: 100px;
  padding: ${props => props.theme.grid.unit}px
    ${props => props.theme.grid.unit * 2}px;
  font-size: 1em;
`

export const SmallNumberField = styled(TextField).attrs({
  type: 'number',
})`
  width: 50px;
  padding: 2px ${props => props.theme.grid.unit * 2}px;
  margin-right: ${props => props.theme.grid.unit * 2}px;
  font-size: 0.75em;
`

export const SmallTextField = styled(TextField).attrs({
  type: 'text',
})`
  width: 25px;
  padding: 2px 4px;
  margin-right: 4px;
  font-size: 0.75em;
`

export const MediumTextField = styled(TextField).attrs({
  type: 'text',
})`
  padding: 8px;
  font-size: 1em;
`

export const MediumTextArea = styled(TextArea)`
  padding: 8px;
  font-size: 1em;
`

export const SpacingRange: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  list,
  ...props
}) => (
  <>
    <StyleRange type={'range'} step={2} list={list} {...props} />

    <datalist id={list}>
      {range(Number(props.min), Number(props.max), Number(props.step)).map(
        i => (
          <option key={i}>{i}</option>
        )
      )}
    </datalist>
  </>
)

export const StyleRange = styled.input`
  flex: 1;
  margin-right: ${props => props.theme.grid.unit * 2}px;
`

export const StyleSelect = styled.select`
  flex: 1;
`

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: ${props => props.theme.grid.unit * 2}px;
`
