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

import { MenuSpec } from '@manuscripts/manuscript-editor'
import { ManuscriptEditorView } from '@manuscripts/manuscript-transform'

export interface MenuItemState {
  id: string
  role?: string
  active?: boolean
  enabled?: boolean
  submenu?: string
}

const isMenuSeparator = (item: MenuSpec): boolean => item.role === 'separator'

const findMenuItem = (items: MenuSpec[], key: string): MenuSpec | null => {
  for (const item of items) {
    if (isMenuSeparator(item)) {
      continue
    }

    if (item.id === key) {
      return item
    }

    if (item.submenu) {
      const child = findMenuItem(item.submenu, key)

      if (child) {
        return child
      }
    }
  }

  return null
}

export const createGetMenuState = (
  view: ManuscriptEditorView,
  menus: MenuSpec[]
) => (key: string): MenuSpec[] => {
  const menu = findMenuItem(menus, key)

  if (!menu) {
    throw new Error(`No menu found with id ${key}`)
  }

  if (!menu.submenu) {
    throw new Error(`${key} is not a menu`)
  }

  return menu.submenu.map((item) => {
    if (isMenuSeparator(item)) {
      return item
    }

    return item
  })
}

export const createDispatchMenuAction = (menus: MenuSpec[]) => (
  key: string
) => {
  const item = findMenuItem(menus, key)

  if (!item) {
    throw new Error(`No menu item found with id ${key}`)
  }

  if (!item.run) {
    throw new Error(`No run action for menu item with id ${key}`)
  }

  item.run()
}
