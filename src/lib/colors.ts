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

import { hasObjectType } from '@manuscripts/manuscript-transform'
import {
  Color,
  ColorScheme,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'

export const DEFAULT_COLOR_SCHEME = 'MPColorScheme:default'

export const isColor = hasObjectType<Color>(ObjectTypes.Color)
export const isColorScheme = hasObjectType<ColorScheme>(ObjectTypes.ColorScheme)

export const nextColorPriority = (colors: Color[]) =>
  Math.max(...colors.map((color) => color.priority || 0)) + 10

const getByPrototype = <T extends Model>(
  modelMap: Map<string, Model>,
  prototype: string
) => {
  for (const model of modelMap.values()) {
    if (model.prototype === prototype) {
      return model as T
    }
  }
}

export const buildColors = (
  modelMap: Map<string, Model>,
  colorSchemeID: string = DEFAULT_COLOR_SCHEME
) => {
  // const colorScheme = modelMap.get(colorSchemeID) as ColorScheme | undefined
  const colorScheme = getByPrototype<ColorScheme>(modelMap, colorSchemeID)

  const colors: Color[] = []

  if (colorScheme && colorScheme.colors) {
    for (const colorID of colorScheme.colors) {
      if (colorID) {
        // const color = modelMap.get(colorID) as Color | undefined
        const color = getByPrototype<Color>(modelMap, colorID)

        if (color && color.value) {
          colors.push(color)
        }
      }
    }

    colors.sort((a, b) => (a.priority || 0) - (b.priority || 0))
  }

  return { colors, colorScheme }
}
