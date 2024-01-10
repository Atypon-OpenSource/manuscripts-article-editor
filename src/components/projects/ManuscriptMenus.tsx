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

import { getEditorMenus, useEditor } from '@manuscripts/body-editor'
import {
  isMenuSeparator,
  Menus,
  MenuSeparator,
  MenuSpec,
  useMenus,
  usePermissions,
} from '@manuscripts/style-guide'
import React from 'react'

import config from '../../config'

interface ApplicationMenusProps {
  editor: ReturnType<typeof useEditor>
}

const processMenu = (
  specs: MenuSpec[],
  fn: (spec: MenuSpec) => MenuSpec | undefined
) => {
  return specs
    .map((spec) => {
      const processed = fn(spec)
      if (processed) {
        if (processed.submenu) {
          processed.submenu = processSubmenu(processed.submenu, fn)
        }
        return processed
      }
    })
    .filter(Boolean) as MenuSpec[]
}

const processSubmenu = (
  specs: (MenuSpec | MenuSeparator)[],
  fn: (spec: MenuSpec) => MenuSpec | undefined
) => {
  return specs
    .map((spec) => {
      if (isMenuSeparator(spec)) {
        return spec
      }
      const processed = fn(spec)
      if (processed) {
        if (processed.submenu) {
          processed.submenu = processSubmenu(processed.submenu, fn)
        }
        return processed
      }
    })
    .filter(Boolean) as (MenuSpec | MenuSeparator)[]
}

export const ManuscriptMenus: React.FC<ApplicationMenusProps> = ({
  editor,
}) => {
  const can = usePermissions()

  const specs = processMenu(getEditorMenus(editor), (spec: MenuSpec) => {
    const id = spec.id
    if (!can.editArticle && (id === 'insert' || id === 'edit')) {
      return undefined
    }
    if (!can.formatArticle && id === 'format') {
      return undefined
    }
    if (!config.features.tableEditing && id === 'format-table') {
      spec.isEnabled = false
    }
    if (!config.features.pullQuotes && id === 'insert-pullquote') {
      spec.isEnabled = false
    }
    return spec
  })

  const { menus, ref, handleClick } = useMenus(specs)
  return <Menus menus={menus} innerRef={ref} handleClick={handleClick} />
}
