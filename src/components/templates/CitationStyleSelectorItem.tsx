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

import { Bundle } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { ListChildComponentProps } from 'react-window'
import { CitationStyleListItem } from './CitationStyleListItem'

interface Props {
  data: {
    filteredItems: Bundle[]
    selectBundle: (item: Bundle) => void
    selectedItem: Bundle
  }
}

export const CitationStyleSelectorItem: React.FunctionComponent<
  ListChildComponentProps & Props
> = ({ data, index, style }) => {
  const { filteredItems, selectBundle } = data

  const item = filteredItems[index]

  const key = item._id

  style = {
    ...style,
    transition: 'all 200ms ease-in-out',
    paddingBottom: '30px',
  }

  return (
    <div style={style} key={key} id={key}>
      <CitationStyleListItem item={item} selectBundle={selectBundle} />
    </div>
  )
}
