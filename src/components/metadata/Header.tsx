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

export const HeaderContainer = styled.header`
  padding: 0 32px;
`

export const Header = styled.div`
  font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  color: ${props => props.theme.colors.global.text.primary};
  border-bottom: 1px solid ${props => props.theme.colors.metadata.border};
  padding: 16px 0;
  margin-bottom: 16px;

  & .ProseMirror {
    font-size: 27px;
    font-weight: 600;
  }
`
