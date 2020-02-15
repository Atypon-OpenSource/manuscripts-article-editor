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

import { ManuscriptNode } from '@manuscripts/manuscript-transform'
import {
  FigureElement,
  FigureStyle,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { buildColors } from '../../lib/colors'
import { findBorderStyles, findFigureStyles } from '../../lib/styles'
import { fromPrototype } from '../../lib/templates'
import { ElementStyleInspectorProps } from './ElementStyleInspector'
import { FigureStyles } from './FigureStyles'

const DEFAULT_FIGURE_STYLE = 'MPFigureStyle:default'

export const FigureStyleInspector: React.FC<
  ElementStyleInspectorProps & {
    element: FigureElement
  }
> = ({ deleteModel, element, manuscript, modelMap, saveModel, view }) => {
  const [error, setError] = useState<Error>()

  const [figureStyle, setFigureStyle] = useState<FigureStyle>()

  const getModel = <T extends Model>(id?: string): T | undefined =>
    id ? (modelMap.get(id) as T | undefined) : undefined

  const getModelByPrototype = <T extends Model>(id?: string): T | undefined => {
    for (const model of modelMap.values()) {
      if (model.prototype === id) {
        return model as T
      }
    }
  }

  const defaultFigureStyle = getModelByPrototype<FigureStyle>(
    DEFAULT_FIGURE_STYLE
  )

  const elementFigureStyle = element.figureStyle
    ? getModel<FigureStyle>(element.figureStyle)
    : defaultFigureStyle

  useEffect(() => {
    setFigureStyle(elementFigureStyle)
  }, [setFigureStyle, elementFigureStyle, JSON.stringify(elementFigureStyle)])

  const debouncedSaveFigureStyle = useCallback(
    debounce((figureStyle: FigureStyle) => {
      saveModel<FigureStyle>(figureStyle).catch(error => {
        setError(error)
      })
    }, 500),
    [setError, saveModel]
  )

  const setElementFigureStyle = useCallback(
    (figureStyle?: string) => {
      const { tr, doc } = view.state

      // TODO: iterator with node + pos

      doc.descendants((node, pos) => {
        if (node.attrs.id === element._id) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            figureStyle,
          })

          view.dispatch(tr)
        }
      })
    },
    [element, view]
  )

  const removeFigureStyleAttr = useCallback(
    (figureStyle: string) => {
      const { tr, doc } = view.state

      const nodesToUpdate: Array<{ node: ManuscriptNode; pos: number }> = []

      doc.descendants((node, pos) => {
        if (node.attrs.figureStyle === figureStyle) {
          nodesToUpdate.push({ node, pos })
        }
      })

      if (nodesToUpdate.length) {
        for (const { node, pos } of nodesToUpdate) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            figureStyle: undefined,
          })
        }

        view.dispatch(tr)
      }
    },
    [view]
  )

  const saveDebouncedFigureStyle = (figureStyle: FigureStyle) => {
    setFigureStyle(figureStyle)

    debouncedSaveFigureStyle(figureStyle)
  }

  const saveFigureStyle = (figureStyle: FigureStyle) => {
    setFigureStyle(figureStyle)

    saveModel<FigureStyle>(figureStyle).catch(error => {
      // TODO: restore previous figureStyle?
      setError(error)
    })
  }

  const duplicateFigureStyle = useCallback(() => {
    if (!figureStyle) {
      throw new Error('No figure style!')
    }

    const newStyle = fromPrototype<FigureStyle>(figureStyle)

    const defaultTitle = `${figureStyle.title} (Copy)`

    const title = window.prompt('New figure style name:', defaultTitle)

    saveModel<FigureStyle>({
      ...newStyle,
      title: title || defaultTitle,
    })
      .then(figureStyle => {
        setElementFigureStyle(figureStyle._id)
      })
      .catch(error => {
        setError(error)
      })
  }, [figureStyle, saveModel, setElementFigureStyle])

  const renameFigureStyle = useCallback(() => {
    if (!figureStyle) {
      throw new Error('No figure style!')
    }

    const title = window.prompt('New figure style name:', figureStyle.title)

    if (title && title !== figureStyle.title) {
      saveFigureStyle({
        ...figureStyle,
        title,
      })
    }
  }, [figureStyle, saveFigureStyle])

  const deleteFigureStyle = useCallback(() => {
    if (!figureStyle) {
      throw new Error('No figure style!')
    }

    if (confirm(`Delete "${figureStyle.title}"?`)) {
      removeFigureStyleAttr(figureStyle._id)

      // TODO: delay removal? only use styles referenced by elements?
      deleteModel(figureStyle._id).catch(error => {
        setError(error)
      })
    }
  }, [deleteModel, figureStyle, setElementFigureStyle])

  // TODO: what should happen if there's no defaultFigureStyle?

  if (!figureStyle || !defaultFigureStyle) {
    return null
  }

  const { colors, colorScheme } = buildColors(modelMap)

  if (!colorScheme) {
    return null
  }

  const figureStyles = findFigureStyles(modelMap)
  const borderStyles = findBorderStyles(modelMap)

  return (
    <FigureStyles
      borderStyles={borderStyles}
      figureStyles={figureStyles}
      colors={colors}
      colorScheme={colorScheme}
      defaultFigureStyle={defaultFigureStyle}
      deleteFigureStyle={deleteFigureStyle}
      duplicateFigureStyle={duplicateFigureStyle}
      error={error}
      figureStyle={figureStyle}
      renameFigureStyle={renameFigureStyle}
      saveDebouncedFigureStyle={saveDebouncedFigureStyle}
      saveModel={saveModel}
      saveFigureStyle={saveFigureStyle}
      setElementFigureStyle={setElementFigureStyle}
      setError={setError}
    />
  )
}
