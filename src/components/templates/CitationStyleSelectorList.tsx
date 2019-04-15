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
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { CitationStyleSelectorItem } from './CitationStyleSelectorItem'

interface Props {
  filteredItems: Bundle[]
  listRef: React.RefObject<FixedSizeList>
  selectBundle: (item: Bundle) => void
}

export class CitationStyleSelectorList extends React.Component<Props> {
  public render() {
    const { filteredItems, listRef, selectBundle } = this.props

    return (
      <AutoSizer>
        {({ height, width }) => (
          <>
            <FixedSizeList
              ref={listRef}
              height={height}
              width={width}
              itemCount={filteredItems.length}
              itemSize={40}
              itemKey={this.getItemKey}
              itemData={{
                filteredItems,
                selectBundle,
              }}
            >
              {CitationStyleSelectorItem}
            </FixedSizeList>
          </>
        )}
      </AutoSizer>
    )
  }

  private getItemKey = (index: number) => this.props.filteredItems[index]._id
}
