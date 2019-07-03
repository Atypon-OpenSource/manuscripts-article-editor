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

import data from '@manuscripts/examples/data/project-dump.json'
import {
  Color,
  Model,
  ParagraphStyle,
} from '@manuscripts/manuscripts-json-schema'
import { buildModelMap } from '../../pressroom/__tests__/util'
import { ProjectDump } from '../../pressroom/importers'
import { isColor } from '../colors'
import { buildParagraphStyles } from '../styles'

const modelMap = buildModelMap(data as ProjectDump)

const getModel = <T extends Model>(id: string) =>
  modelMap.get(id) as T | undefined

const buildColors = (modelMap: Map<string, Model>) => {
  const items = new Map<string, Color>()

  for (const model of modelMap.values()) {
    if (isColor(model)) {
      items.set(model._id, model)
    }
  }

  return items
}

const colors = buildColors(modelMap)

describe('styles', () => {
  test('build paragraph styles', () => {
    const model = getModel<ParagraphStyle>(
      'MPParagraphStyle:74D17A3A-33C0-43EB-9389-51335C698744'
    )

    if (!model) {
      throw new Error('Model not found!')
    }

    const result = buildParagraphStyles(model, colors)

    expect(result).toMatchSnapshot('build-paragraph-styles')
  })
})
