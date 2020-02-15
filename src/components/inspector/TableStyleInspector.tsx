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
  Model,
  TableElement,
  TableStyle,
} from '@manuscripts/manuscripts-json-schema'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { buildColors } from '../../lib/colors'
import { findBorderStyles, findTableStyles } from '../../lib/styles'
import { fromPrototype } from '../../lib/templates'
import { ElementStyleInspectorProps } from './ElementStyleInspector'
import { TableStyles } from './TableStyles'

const DEFAULT_TABLE_STYLE = 'MPTableStyle:default'

export const TableStyleInspector: React.FC<
  ElementStyleInspectorProps & {
    element: TableElement
  }
> = ({ deleteModel, element, manuscript, modelMap, saveModel, view }) => {
  const [error, setError] = useState<Error>()

  const [tableStyle, setTableStyle] = useState<TableStyle>()

  const getModel = <T extends Model>(id?: string) =>
    id ? (modelMap.get(id) as T | undefined) : undefined

  const getModelByPrototype = <T extends Model>(id?: string): T | undefined => {
    for (const model of modelMap.values()) {
      if (model.prototype === id) {
        return model as T
      }
    }
  }

  const defaultTableStyle = getModelByPrototype<TableStyle>(DEFAULT_TABLE_STYLE)

  const elementTableStyle = element.tableStyle
    ? getModel<TableStyle>(element.tableStyle)
    : defaultTableStyle

  useEffect(() => {
    setTableStyle(elementTableStyle)
  }, [setTableStyle, elementTableStyle, JSON.stringify(elementTableStyle)])

  const debouncedSaveTableStyle = useCallback(
    debounce((tableStyle: TableStyle) => {
      saveModel<TableStyle>(tableStyle).catch(error => {
        setError(error)
      })
    }, 500),
    [setError, saveModel]
  )

  const setElementTableStyle = useCallback(
    (tableStyle?: string) => {
      const { tr, doc } = view.state

      // TODO: iterator with node + pos

      doc.descendants((node, pos) => {
        if (node.attrs.id === element._id) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            tableStyle,
          })

          view.dispatch(tr)
        }
      })
    },
    [element, view]
  )

  const removeTableStyleAttr = useCallback(
    (tableStyle: string) => {
      const { tr, doc } = view.state

      const nodesToUpdate: Array<{ node: ManuscriptNode; pos: number }> = []

      doc.descendants((node, pos) => {
        if (node.attrs.tableStyle === tableStyle) {
          nodesToUpdate.push({ node, pos })
        }
      })

      if (nodesToUpdate.length) {
        for (const { node, pos } of nodesToUpdate) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            tableStyle: undefined,
          })
        }

        view.dispatch(tr)
      }
    },
    [view]
  )

  const saveDebouncedTableStyle = (tableStyle: TableStyle) => {
    setTableStyle(tableStyle)

    debouncedSaveTableStyle(tableStyle)
  }

  const saveTableStyle = (tableStyle: TableStyle) => {
    setTableStyle(tableStyle)

    saveModel<TableStyle>(tableStyle).catch(error => {
      // TODO: restore previous tableStyle?
      setError(error)
    })
  }

  const duplicateTableStyle = useCallback(() => {
    if (!tableStyle) {
      throw new Error('No table style!')
    }

    const newStyle = fromPrototype<TableStyle>(tableStyle)

    const defaultTitle = `${tableStyle.title} (Copy)`

    const title = window.prompt('New table style name:', defaultTitle)

    saveModel<TableStyle>({
      ...newStyle,
      title: title || defaultTitle,
    })
      .then(tableStyle => {
        setElementTableStyle(tableStyle._id)
      })
      .catch(error => {
        setError(error)
      })
  }, [tableStyle, saveModel, setElementTableStyle])

  const renameTableStyle = useCallback(() => {
    if (!tableStyle) {
      throw new Error('No table style!')
    }

    const title = window.prompt('New table style name:', tableStyle.title)

    if (title && title !== tableStyle.title) {
      saveTableStyle({
        ...tableStyle,
        title,
      })
    }
  }, [tableStyle, saveTableStyle])

  const deleteTableStyle = useCallback(() => {
    if (!tableStyle) {
      throw new Error('No table style!')
    }

    if (confirm(`Delete "${tableStyle.title}"?`)) {
      removeTableStyleAttr(tableStyle._id)

      // TODO: delay removal? only use styles referenced by elements?
      deleteModel(tableStyle._id).catch(error => {
        setError(error)
      })
    }
  }, [deleteModel, tableStyle, setElementTableStyle])

  // TODO: what should happen if there's no defaultTableStyle?

  if (!tableStyle || !defaultTableStyle) {
    return null
  }

  const { colors, colorScheme } = buildColors(modelMap)

  if (!colorScheme) {
    return null
  }

  const tableStyles = findTableStyles(modelMap)
  const borderStyles = findBorderStyles(modelMap)

  return (
    <TableStyles
      tableStyles={tableStyles}
      borderStyles={borderStyles}
      colors={colors}
      colorScheme={colorScheme}
      defaultTableStyle={defaultTableStyle}
      deleteTableStyle={deleteTableStyle}
      duplicateTableStyle={duplicateTableStyle}
      error={error}
      tableStyle={tableStyle}
      renameTableStyle={renameTableStyle}
      saveDebouncedTableStyle={saveDebouncedTableStyle}
      saveModel={saveModel}
      saveTableStyle={saveTableStyle}
      setElementTableStyle={setElementTableStyle}
      setError={setError}
    />
  )
}
