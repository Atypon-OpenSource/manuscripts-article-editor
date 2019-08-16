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

import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'

const CustomRadioButton = styled.div`
  position: absolute;
  top: 2px;
  left: 0;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  border: solid 1px ${props => props.theme.colors.radioButton.border};

  &:after {
    position: absolute;
    display: none;
    content: '';
  }
`

const TextHint = styled.span`
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.2px;
  text-align: left;
  color: ${props => props.theme.colors.radioButton.hint};
  clear: both;
  display: block;
  padding-bottom: 10px;
`

const Control = styled.label`
  font-size: 18px;
  white-space: normal;
  font-weight: 300;
  position: relative;
  display: block;
  line-height: 1.06;
  letter-spacing: normal;
  padding-left: 30px;
  cursor: pointer;

  & input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  &:hover input ~ ${CustomRadioButton} {
    background-color: ${props =>
      props.theme.colors.radioButton.enabled.hovered};
  }

  &:hover input:checked:enabled ~ ${CustomRadioButton} {
    background-color: ${props =>
      props.theme.colors.radioButton.enabled.checked};
  }

  & input:disabled ~ ${CustomRadioButton} {
    background-color: ${props =>
      props.theme.colors.radioButton.disabled.unchecked};
  }

  & ${CustomRadioButton}:after {
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.theme.colors.radioButton.enabled.checked};
  }

  & input:checked ~ ${CustomRadioButton}:after {
    display: block;
  }

  & input:checked:disabled ~ ${CustomRadioButton}:after {
    background: ${props => props.theme.colors.radioButton.disabled.checked};
  }

  & ${TextHint} {
    margin: 4px 0 6px;
  }
`

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  textHint?: string
}

export const RadioButton: React.FunctionComponent<Props> = ({
  children,
  textHint,
  ...rest
}) => (
  <Control>
    <input {...rest} type={'radio'} />
    <CustomRadioButton />
    {children}
    {textHint && <TextHint>{textHint}</TextHint>}
  </Control>
)
