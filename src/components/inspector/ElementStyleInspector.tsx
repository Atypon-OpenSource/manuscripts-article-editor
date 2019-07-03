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

import {
  DEFAULT_PAGE_LAYOUT,
  ManuscriptEditorView,
  ManuscriptNode,
} from '@manuscripts/manuscript-transform'
import {
  ListElement,
  Manuscript,
  Model,
  PageLayout,
  ParagraphElement,
  ParagraphStyle,
  TableElement,
} from '@manuscripts/manuscripts-json-schema'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { buildColors } from '../../lib/colors'
import { findBodyTextParagraphStyles } from '../../lib/styles'
import { fromPrototype } from '../../lib/templates'
import { ParagraphStyles } from './ParagraphStyles'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export type AnyElement = ParagraphElement | ListElement | TableElement

export const ElementStyleInspector: React.FC<{
  element: AnyElement
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveModel: SaveModel
  deleteModel: (id: string) => Promise<string>
  view: ManuscriptEditorView
}> = ({ deleteModel, element, manuscript, modelMap, saveModel, view }) => {
  const [error, setError] = useState<Error>()

  const [paragraphStyle, setParagraphStyle] = useState<ParagraphStyle>()

  const getModel = <T extends Model>(id?: string) =>
    id ? (modelMap.get(id) as T | undefined) : undefined

  const findDefaultParagraphStyle = (): ParagraphStyle | undefined => {
    const pageLayout = getModel<PageLayout>(
      manuscript.pageLayout || DEFAULT_PAGE_LAYOUT
    )

    if (pageLayout) {
      return getModel<ParagraphStyle>(pageLayout.defaultParagraphStyle)
    }
  }

  const defaultParagraphStyle = findDefaultParagraphStyle()

  const elementParagraphStyle = element.paragraphStyle
    ? getModel<ParagraphStyle>(element.paragraphStyle)
    : defaultParagraphStyle

  useEffect(() => {
    setParagraphStyle(elementParagraphStyle)
  }, [
    setParagraphStyle,
    elementParagraphStyle,
    JSON.stringify(elementParagraphStyle),
  ])

  const debouncedSaveParagraphStyle = useCallback(
    debounce((paragraphStyle: ParagraphStyle) => {
      saveModel<ParagraphStyle>(paragraphStyle).catch(error => {
        setError(error)
      })
    }, 500),
    [setError, saveModel]
  )

  const setElementParagraphStyle = useCallback(
    (paragraphStyle?: string) => {
      const { tr, doc } = view.state

      // TODO: iterator with node + pos

      doc.descendants((node, pos) => {
        if (node.attrs.id === element._id) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            paragraphStyle,
          })

          view.dispatch(tr)
        }
      })
    },
    [element, view]
  )

  const removeParagraphStyleAttr = useCallback(
    (paragraphStyle: string) => {
      const { tr, doc } = view.state

      const nodesToUpdate: Array<{ node: ManuscriptNode; pos: number }> = []

      doc.descendants((node, pos) => {
        if (node.attrs.paragraphStyle === paragraphStyle) {
          nodesToUpdate.push({ node, pos })
        }
      })

      if (nodesToUpdate.length) {
        for (const { node, pos } of nodesToUpdate) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            paragraphStyle: undefined,
          })
        }

        view.dispatch(tr)
      }
    },
    [view]
  )

  const saveDebouncedParagraphStyle = (paragraphStyle: ParagraphStyle) => {
    setParagraphStyle(paragraphStyle)

    debouncedSaveParagraphStyle(paragraphStyle)
  }

  const saveParagraphStyle = (paragraphStyle: ParagraphStyle) => {
    setParagraphStyle(paragraphStyle)

    saveModel<ParagraphStyle>(paragraphStyle).catch(error => {
      // TODO: restore previous paragraphStyle?
      setError(error)
    })
  }

  const duplicateParagraphStyle = useCallback(() => {
    if (!paragraphStyle) {
      throw new Error('No paragraph style!')
    }

    const newStyle = fromPrototype<ParagraphStyle>(paragraphStyle)

    const defaultTitle = `${paragraphStyle.title} (Copy)`

    const title = window.prompt('New paragraph style name:', defaultTitle)

    saveModel<ParagraphStyle>({
      ...newStyle,
      title: title || defaultTitle,
    })
      .then(paragraphStyle => {
        setElementParagraphStyle(paragraphStyle._id)
      })
      .catch(error => {
        setError(error)
      })
  }, [paragraphStyle, saveModel, setElementParagraphStyle])

  const renameParagraphStyle = useCallback(() => {
    if (!paragraphStyle) {
      throw new Error('No paragraph style!')
    }

    const title = window.prompt(
      'New paragraph style name:',
      paragraphStyle.title
    )

    if (title && title !== paragraphStyle.title) {
      saveParagraphStyle({
        ...paragraphStyle,
        title,
      })
    }
  }, [paragraphStyle, saveParagraphStyle])

  const deleteParagraphStyle = useCallback(() => {
    if (!paragraphStyle) {
      throw new Error('No paragraph style!')
    }

    if (confirm(`Delete "${paragraphStyle.title}"?`)) {
      removeParagraphStyleAttr(paragraphStyle._id)

      // TODO: delay removal? only use styles referenced by elements?
      deleteModel(paragraphStyle._id).catch(error => {
        setError(error)
      })
    }
  }, [deleteModel, paragraphStyle, setElementParagraphStyle])

  // TODO: what should happen if there's no defaultParagraphStyle?

  if (!paragraphStyle || !defaultParagraphStyle) {
    return null
  }

  const { colors, colorScheme } = buildColors(modelMap)

  if (!colorScheme) {
    return null
  }

  const bodyTextParagraphStyles = findBodyTextParagraphStyles(modelMap)

  return (
    <ParagraphStyles
      bodyTextParagraphStyles={bodyTextParagraphStyles}
      colors={colors}
      colorScheme={colorScheme}
      defaultParagraphStyle={defaultParagraphStyle}
      deleteParagraphStyle={deleteParagraphStyle}
      duplicateParagraphStyle={duplicateParagraphStyle}
      error={error}
      paragraphStyle={paragraphStyle}
      renameParagraphStyle={renameParagraphStyle}
      saveDebouncedParagraphStyle={saveDebouncedParagraphStyle}
      saveModel={saveModel}
      saveParagraphStyle={saveParagraphStyle}
      setElementParagraphStyle={setElementParagraphStyle}
      setError={setError}
    />
  )
}
