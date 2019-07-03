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
  Math.max(...colors.map(color => color.priority)) + 10

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

    colors.sort((a, b) => a.priority - b.priority)
  }

  return { colors, colorScheme }
}
