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

import {
  hasObjectType,
  ManuscriptEditorView,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyElement,
  FigureElement,
  KeywordsElement,
  ListElement,
  Manuscript,
  Model,
  ObjectTypes,
  ParagraphElement,
  QuoteElement,
  TableElement,
  TOCElement,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { FigureLayoutInspector } from './FigureLayoutInspector'
import { FigureStyleInspector } from './FigureStyleInspector'
import {
  hasParagraphStyle,
  ParagraphStyleInspector,
} from './ParagraphStyleInspector'
import { TableStyleInspector } from './TableStyleInspector'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export type AnyElement =
  | ParagraphElement
  | ListElement
  | TableElement
  | FigureElement
  | BibliographyElement
  | KeywordsElement
  | TOCElement
  | QuoteElement

export interface ElementStyleInspectorProps {
  element: AnyElement
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveModel: SaveModel
  deleteModel: (id: string) => Promise<string>
  view: ManuscriptEditorView
}

const isFigureElement = hasObjectType<FigureElement>(ObjectTypes.FigureElement)
const isTableElement = hasObjectType<TableElement>(ObjectTypes.TableElement)

export const ElementStyleInspector: React.FC<ElementStyleInspectorProps> = props => {
  const { element } = props

  if (isFigureElement(element)) {
    return (
      <>
        <FigureLayoutInspector {...props} element={element} />
        <FigureStyleInspector {...props} element={element} />
      </>
    )
  }

  return (
    <>
      {hasParagraphStyle(element) && (
        <ParagraphStyleInspector {...props} element={element} />
      )}

      {isTableElement(element) && (
        <TableStyleInspector {...props} element={element} />
      )}
    </>
  )
}
