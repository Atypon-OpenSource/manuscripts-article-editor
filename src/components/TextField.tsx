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

import { styled } from '../theme/styled-components'
import { ErrorProps } from './Form'

export const TextField = styled.input<ErrorProps>`
  display: block;
  font-size: 16px;
  padding: 10px 15px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid
    ${props =>
      props.error
        ? props.theme.colors.textField.border.error
        : props.theme.colors.textField.border.default};
  border-radius: 5px;
  z-index: ${props => (props.error ? 2 : 1)};
  position: relative;

  &:invalid {
    box-shadow: none;
  }

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textField.placeholder.default};
  }

  &:hover {
    &::placeholder {
      color: ${props => props.theme.colors.textField.placeholder.hovered};
    }
  }
`

export const TextFieldGroup = styled.div`
  & ${TextField}:first-of-type {
    margin-top: 5px;
  }

  & ${TextField}:last-of-type {
    margin-bottom: 5px;
  }

  & ${TextField}:not(:first-of-type) {
    margin-top: -1px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  & ${TextField}:not(:last-of-type) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-bottom: 0;
  }
`

export const TextArea = styled.textarea`
  font-size: 16px;
  padding: 10px 15px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.colors.textField.border.default};
  border-radius: 5px;
  height: 170px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textField.placeholder.default};
  }

  &:hover {
    &::placeholder {
      color: ${props => props.theme.colors.textField.placeholder.hovered};
    }
  }
`

export const TextFieldLabel = styled.label`
  text-transform: uppercase;
  color: gray;

  & ${TextField} {
    margin-top: 5px;
  }

  & ${TextArea} {
    margin-top: 5px;
  }
`
