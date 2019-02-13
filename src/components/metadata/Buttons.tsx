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

import { styled } from '../../theme/styled-components'

export const EditButton = styled.button`
  border-radius: 5px;
  border: solid 1px ${props => props.theme.colors.button.primary};
  background: ${props => props.theme.colors.button.primary};
  color: white;
  padding: 1px 7px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;

  &:focus {
    outline: none;
  }

  &:hover {
    background: transparent;
    color: ${props => props.theme.colors.button.primary};
  }
`
