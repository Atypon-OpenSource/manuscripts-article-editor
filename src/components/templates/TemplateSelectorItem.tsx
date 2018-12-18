import React from 'react'
import { ListChildComponentProps } from 'react-window'
import { TemplateData } from '../../types/templates'
import { TemplateListItem } from './TemplateListItem'

interface Props {
  data: {
    filteredItems: TemplateData[]
    selectTemplate: (item: TemplateData) => void
    selectItem: (item: TemplateData) => void
    selectedItem: TemplateData
  }
}

export const TemplateSelectorItem: React.FunctionComponent<
  ListChildComponentProps & Props
> = ({ data, index, style }) => {
  const { filteredItems, selectedItem, selectItem, selectTemplate } = data

  const item = filteredItems[index]

  const { bundle, template, title, articleType, publisher } = item

  const key = template ? template._id : bundle!._id

  style = {
    ...style,
    transition: 'all 200ms ease-in-out',
  }

  return (
    <div style={style} key={key} id={key}>
      <TemplateListItem
        articleType={articleType}
        item={item}
        publisher={publisher}
        selectItem={selectItem}
        selectTemplate={selectTemplate}
        template={template}
        title={title}
        selected={item === selectedItem}
      />
    </div>
  )
}
