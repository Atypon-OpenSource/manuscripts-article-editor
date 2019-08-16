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

import React from 'react'
import ReactDOM from 'react-dom'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList } from 'react-window'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { TemplateData } from '../../types/templates'
import { TemplateListItem } from './TemplateListItem'
import { TemplateSelectorItem } from './TemplateSelectorItem'

interface Props {
  filteredItems: TemplateData[]
  listRef: React.RefObject<VariableSizeList>
  resetList: (index: number) => void
  selectTemplate: (item: TemplateData) => void
}

interface State {
  selectedItem?: TemplateData
  selectedItemHeight?: number
}

export class TemplateSelectorList extends React.Component<Props, State> {
  public state: Readonly<State> = {}

  public render() {
    const { filteredItems, listRef, selectTemplate } = this.props
    const { selectedItem } = this.state

    return (
      <AutoSizer>
        {({ height, width }) => (
          <>
            <VariableSizeList
              ref={listRef}
              height={height}
              width={width}
              itemCount={filteredItems.length}
              itemSize={this.getItemSize}
              itemKey={this.getItemKey}
              itemData={{
                filteredItems,
                selectedItem,
                selectItem: this.selectItem(width),
                selectTemplate,
              }}
            >
              {TemplateSelectorItem}
            </VariableSizeList>
          </>
        )}
      </AutoSizer>
    )
  }

  private selectItem = (width: number) => (item: TemplateData) => {
    const selectedItem = item === this.state.selectedItem ? undefined : item

    if (selectedItem) {
      this.measureSelectedItem(selectedItem, width)
    } else {
      this.setState(
        {
          selectedItem: undefined,
          selectedItemHeight: undefined,
        },
        () => {
          this.props.resetList(0)
        }
      )
    }
  }

  private measureSelectedItem = (selectedItem: TemplateData, width: number) => {
    const container = document.createElement('div')
    container.style.width = width + 'px'
    container.style.visibility = 'hidden'
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    document.body.appendChild(container)

    ReactDOM.render(
      <ThemeProvider>
        <TemplateListItem
          articleType={selectedItem.articleType}
          item={selectedItem}
          publisher={selectedItem.publisher}
          selectItem={this.selectItem(width)}
          selectTemplate={this.props.selectTemplate}
          template={selectedItem.template}
          title={selectedItem.title}
          selected={true}
        />
      </ThemeProvider>,
      container,
      () => {
        const selectedItemHeight = container.clientHeight

        document.body.removeChild(container)

        this.setState({ selectedItem, selectedItemHeight }, () => {
          this.props.resetList(0)
        })
      }
    )
  }

  private getItemSize = (index: number): number => {
    const item = this.props.filteredItems[index]

    if (item === this.state.selectedItem) {
      return this.state.selectedItemHeight!
    }

    return this.calculateItemSize(item)
  }

  private getItemKey = (index: number) =>
    this.calculateItemKey(this.props.filteredItems[index])

  private calculateItemSize = (item: TemplateData) => {
    let size = 46

    if (item.template && (item.template.aim || item.template.desc)) {
      size += 17
    }

    return size
  }

  private calculateItemKey = (item: TemplateData) =>
    item.template ? item.template._id : item.bundle!._id
}
