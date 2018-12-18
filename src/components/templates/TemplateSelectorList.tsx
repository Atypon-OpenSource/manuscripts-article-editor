import React from 'react'
import ReactDOM from 'react-dom'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList } from 'react-window'
import { ThemeProvider } from '../../theme'
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

    if (item.publisher && item.publisher.name) {
      size += 19
    }

    if (item.template && item.template.desc) {
      size += 19
    }

    return size
  }

  private calculateItemKey = (item: TemplateData) =>
    item.template ? item.template._id : item.bundle!._id
}
