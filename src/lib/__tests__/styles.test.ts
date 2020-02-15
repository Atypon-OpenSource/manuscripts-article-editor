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

import data from '@manuscripts/examples/data/project-dump.json'
import {
  BorderStyle,
  Color,
  FigureStyle,
  Model,
  ParagraphStyle,
  TableStyle,
} from '@manuscripts/manuscripts-json-schema'
import { buildModelMap } from '../../pressroom/__tests__/util'
import { ProjectDump } from '../../pressroom/importers'
import { isColor } from '../colors'
import {
  buildFigureStyles,
  buildParagraphStyles,
  buildTableStyles,
  isBorderStyle,
} from '../styles'

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

const buildBorderStyles = (modelMap: Map<string, Model>) => {
  const items = new Map<string, BorderStyle>()

  for (const model of modelMap.values()) {
    if (isBorderStyle(model)) {
      items.set(model._id, model)
    }
  }

  return items
}

const borderStyles = buildBorderStyles(modelMap)

describe('styles', () => {
  test('build paragraph styles', () => {
    const model = getModel<ParagraphStyle>(
      'MPParagraphStyle:74D17A3A-33C0-43EB-9389-51335C698744'
    )

    if (!model) {
      throw new Error('Model not found!')
    }

    const result = buildParagraphStyles(model, colors)

    expect(result).toMatchSnapshot()
  })

  test('build figure styles', () => {
    const model = getModel<FigureStyle>(
      'MPFigureStyle:12916784-C8A2-414E-919D-490172E82B25'
    )

    if (!model) {
      throw new Error('Model not found!')
    }

    const result = buildFigureStyles(model, colors, borderStyles)

    expect(result).toMatchSnapshot('')
  })

  test('build table styles', () => {
    const model = getModel<TableStyle>(
      'MPTableStyle:08C0E93B-848D-491F-8EB2-A8A0B17714BA'
    )

    if (!model) {
      throw new Error('Model not found!')
    }

    const result = buildTableStyles(model, colors, borderStyles)

    expect(result).toMatchSnapshot('')
  })
})
