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
import { ListChildComponentProps } from 'react-window'

import { TemplateData } from '../../types/templates'
import { TemplateListItem } from './TemplateListItem'

interface Props {
  data: {
    filteredItems: TemplateData[]
    selectItem: (item: TemplateData) => void
    selectedItem: TemplateData
  }
}

export const TemplateSelectorItem: React.FunctionComponent<
  ListChildComponentProps & Props
> = ({ data, index, style }) => {
  const { filteredItems, selectedItem, selectItem } = data

  const item = filteredItems[index]

  const { bundle, template, title, articleType, publisher } = item

  const key = template ? template._id : bundle._id

  style = {
    ...style,
    transition: 'all 200ms ease-in-out',
    paddingBottom: '12px',
  }

  return (
    <div style={style} key={key} id={key}>
      <TemplateListItem
        articleType={articleType}
        item={item}
        publisher={publisher}
        selectItem={selectItem}
        template={template}
        title={title}
        selected={item === selectedItem}
      />
    </div>
  )
}
