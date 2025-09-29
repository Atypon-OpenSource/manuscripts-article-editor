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
  Capabilities,
  isMenuSeparator,
  Menus,
  MenuSeparator,
  MenuSpec,
  useMenus,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useMemo } from 'react'

import { useStore } from '../../store'

const isAccessGranted = (spec: MenuSpec, can: Capabilities) => {
  if (spec.id === 'insert' || spec.id === 'edit') {
    return can.editArticle
  }
  if (spec.id === 'format') {
    return can.formatArticle
  }
  return true
}

const isMenuEnabled = (spec: MenuSpec) => {
  return spec.isEnabled
}

const filterSubmenu = (
  items: (MenuSpec | MenuSeparator)[],
  can: Capabilities
): (MenuSpec | MenuSeparator)[] => {
  const filtered: (MenuSpec | MenuSeparator)[] = []
  let previousWasSeparator = false

  for (const item of items) {
    if (isMenuSeparator(item)) {
      // Only add separator if previous item wasn't a separator
      if (!previousWasSeparator && filtered.length > 0) {
        filtered.push(item)
        previousWasSeparator = true
      }
    } else {
      const filteredItem = filterMenu(item, can)
      if (filteredItem) {
        filtered.push(filteredItem)
        previousWasSeparator = false
      }
    }
  }

  return filtered
}

const filterMenu = (
  spec: MenuSpec,
  can: Capabilities
): MenuSpec | undefined => {
  if (spec.isHidden === true) {
    return undefined
  }
  if (!isAccessGranted(spec, can)) {
    return undefined
  }

  const submenu = spec.submenu ? filterSubmenu(spec.submenu, can) : undefined

  return {
    ...spec,
    isEnabled: isMenuEnabled(spec),
    submenu: submenu,
  } as MenuSpec
}

const getFilteredMenus = (
  editor: ReturnType<typeof useEditor>,
  can: Capabilities
) => {
  return getEditorMenus(editor)
    .map((m) => filterMenu(m, can))
    .filter(Boolean) as MenuSpec[]
}

export const ManuscriptMenus: React.FC = () => {
  const can = usePermissions()
  const [editor] = useStore((store) => store.editor)

  const specs = useMemo(() => {
    if (!editor) {
      return []
    }
    return getFilteredMenus(editor, can)
  }, [can, editor])

  const { menus, ref, handleClick } = useMenus(specs)

  return <Menus menus={menus} innerRef={ref} handleClick={handleClick} />
}
