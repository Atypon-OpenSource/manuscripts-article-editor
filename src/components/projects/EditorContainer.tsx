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

import { lightAliceBlue } from '../../theme/colors'
import { styled } from '../../theme/styled-components'

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 16px;
  overflow: hidden;
  padding-left: 16px;
  background: ${lightAliceBlue};
  border-right: 1px solid
    ${props => props.theme.colors.sidebar.background.selected};
`

export const EditorContainerInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 950px;
  max-width: 100%;
  padding-left: 12px;
  background: white;
  border: 1px solid ${props => props.theme.colors.sidebar.background.selected};
  border-bottom: none;
  border-top: none;
`

export const EditorHeader = styled.div`
  padding: 4px 24px 20px;
  background: white;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) 16px
  );
  z-index: 5;
`

export const EditorBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  padding-right: 8px;
  margin-top: -16px;
  padding-top: 16px;
`
