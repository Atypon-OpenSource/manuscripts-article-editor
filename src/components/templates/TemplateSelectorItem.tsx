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

  const key = template ? template._id : bundle._id

  style = {
    ...style,
    transition: 'all 200ms ease-in-out',
    paddingBottom: '30px',
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
