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

import { debounceRender } from '@manuscripts/manuscript-editor'
import { Tab, TabList } from '@reach/tabs'
import { styled } from '../theme/styled-components'

export const Inspector = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 400px;
  padding-right: 16px;
`

export const DebouncedInspector = debounceRender(Inspector, 100, {
  leading: true,
  maxWait: 500,
})

export const InspectorTabList = styled(TabList)`
  && {
    background: none;
    justify-content: center;
    font-size: 14px;
  }
`

export const InspectorTab = styled(Tab)`
  && {
    background: none;
    padding: 8px;
    border-bottom-width: 2px;

    &:focus {
      outline: none;
    }

    &[data-selected] {
      border-bottom-color: #2a6f9d;
    }
  }
`
