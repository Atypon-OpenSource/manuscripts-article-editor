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

import { TextField } from '@manuscripts/style-guide'
import { styled } from '../../theme/styled-components'

export const NumberField = styled(TextField).attrs({
  type: 'number',
  min: 1,
  step: 1,
  pattern: '[0-9]+',
})`
  width: 100px;
  padding: 4px 8px;
  font-size: 1em;
`

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 8px;
`
