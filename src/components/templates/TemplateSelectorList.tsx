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

import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { VariableSizeList } from 'react-window'

import { TemplateData } from '../../lib/templates'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { TemplateListItem } from './TemplateListItem'
import { TemplateSelectorItem } from './TemplateSelectorItem'

const calculateItemKey = (item: TemplateData) =>
  item.template ? item.template._id : item.bundle!._id

export const TemplateSelectorList: React.FC<{
  filteredItems: TemplateData[]
  height: number
  listRef: React.RefObject<VariableSizeList>
  resetList: (index: number) => void
  selectItem: (item?: TemplateData) => void
  width: number
}> = React.memo(
  ({ filteredItems, height, listRef, resetList, selectItem, width }) => {
    const [selectedItem, setSelectedItem] = useState<TemplateData>()
    const [selectedItemHeight, setSelectedItemHeight] = useState<number>()

    const getItemSize = useCallback(
      (index: number): number => {
        const item = filteredItems[index]

        if (item === selectedItem && selectedItemHeight) {
          return selectedItemHeight
        }

        return 48
      },
      [filteredItems, selectedItem, selectedItemHeight]
    )

    const getItemKey = useCallback(
      (index: number) => calculateItemKey(filteredItems[index]),
      [filteredItems]
    )

    const handleSelectItem = useCallback(
      (item?: TemplateData) => {
        if (item) {
          const container = document.createElement('div')
          container.style.width = width + 'px'
          container.style.visibility = 'hidden'
          container.style.position = 'absolute'
          container.style.left = '-9999px'
          document.body.appendChild(container)

          ReactDOM.render(
            <ThemeProvider>
              <TemplateListItem
                articleType={item.articleType}
                item={item}
                publisher={item.publisher}
                selectItem={handleSelectItem}
                template={item.template}
                title={item.title}
                selected={true}
              />
            </ThemeProvider>,
            container,
            () => {
              const clientHeight = container.clientHeight
              document.body.removeChild(container)
              setSelectedItem(item)
              setSelectedItemHeight(clientHeight)
              resetList(0)
              selectItem(item)
            }
          )
        } else {
          setSelectedItemHeight(undefined)
          resetList(0)
        }
      },
      [width, resetList, selectItem]
    )

    return (
      <VariableSizeList
        ref={listRef}
        height={height}
        width={width}
        itemCount={filteredItems.length}
        itemSize={getItemSize}
        itemKey={getItemKey}
        itemData={{ filteredItems, selectedItem, selectItem: handleSelectItem }}
      >
        {TemplateSelectorItem}
      </VariableSizeList>
    )
  }
)
