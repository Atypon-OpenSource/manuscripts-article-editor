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

import { FigureNode, ManuscriptNode } from '@manuscripts/manuscript-transform'
import {
  FigureElement,
  FigureLayout,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import React, { useCallback, useEffect, useState } from 'react'
import { setNodeAttrs } from '../../lib/node-attrs'
import { findFigureLayouts } from '../../lib/styles'
import { ElementStyleInspectorProps } from './ElementStyleInspector'
import { FigureLayouts } from './FigureLayouts'

const DEFAULT_FIGURE_LAYOUT = 'MPFigureLayout:default'

export const FigureLayoutInspector: React.FC<
  ElementStyleInspectorProps & {
    element: FigureElement
  }
> = ({ element, modelMap, view }) => {
  const [figureLayout, setFigureLayout] = useState<FigureLayout>()

  const getModel = <T extends Model>(id?: string): T | undefined =>
    id ? (modelMap.get(id) as T | undefined) : undefined

  const getModelByPrototype = <T extends Model>(id?: string): T | undefined => {
    for (const model of modelMap.values()) {
      if (model.prototype === id) {
        return model as T
      }
    }
  }

  const defaultFigureLayout = getModelByPrototype<FigureLayout>(
    DEFAULT_FIGURE_LAYOUT
  )

  const elementFigureLayout = element.figureLayout
    ? getModel<FigureLayout>(element.figureLayout)
    : defaultFigureLayout

  useEffect(() => {
    setFigureLayout(elementFigureLayout)
  }, [elementFigureLayout, JSON.stringify(elementFigureLayout)])

  const setElementFigureLayout = useCallback(
    (figureLayoutID?: string) => {
      const { tr, doc } = view.state

      // TODO: iterator with node + pos

      doc.descendants((node, pos) => {
        if (node.attrs.id === element._id) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            figureLayout: figureLayoutID,
          })

          const figureType = node.type.schema.nodes.figure

          const figures: ManuscriptNode[] = []

          node.forEach((child, offset) => {
            if (child.type === figureType) {
              figures.push(child) // TODO: placeholders?
            }
          })

          const figuresSize: number = figures.reduce(
            (output, figure) => output + figure.nodeSize,
            0
          )

          const nextFigurePos = pos + 1 + figuresSize

          const figureLayout = getModel<FigureLayout>(figureLayoutID)

          if (figureLayout) {
            const figuresWanted = figureLayout.columns * figureLayout.rows

            if (figuresWanted > figures.length) {
              const figuresToInsert: FigureNode[] = []

              for (let i = figures.length; i < figuresWanted; i++) {
                figuresToInsert.push(figureType.createAndFill() as FigureNode)
              }

              tr.insert(nextFigurePos, figuresToInsert)
            } else if (figures.length > figuresWanted) {
              const keep = figures
                .slice(0, figuresWanted)
                .reduce((output, figure) => output + figure.nodeSize, 0)

              tr.delete(pos + 1 + keep, pos + node.nodeSize - 1)
            }
          }

          view.dispatch(tr)
        }
      })
    },
    [element, view]
  )

  const setElementSizeFraction = useCallback(
    (sizeFraction?: number) => {
      setNodeAttrs(view, element._id, { sizeFraction })
    },
    [element, view]
  )

  if (!figureLayout) {
    return null
  }

  const figureLayouts = findFigureLayouts(modelMap)

  return (
    <FigureLayouts
      figureElement={element}
      figureLayouts={figureLayouts}
      figureLayout={figureLayout}
      setElementFigureLayout={setElementFigureLayout}
      setElementSizeFraction={setElementSizeFraction}
    />
  )
}
