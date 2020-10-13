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
  FigureStyle,
  Model,
  ParagraphStyle,
  TableStyle,
} from '@manuscripts/manuscripts-json-schema'
import styled from 'styled-components'

export type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export type SaveFigureStyle = (style: FigureStyle) => void
export type SaveParagraphStyle = (style: ParagraphStyle) => void
export type SaveTableStyle = (style: TableStyle) => void

// TODO: use nullish coalescing instead
export const valueOrDefault = <T extends number | string | boolean>(
  value: T | undefined,
  defaultValue: T
): T => (value === undefined ? defaultValue : value)

export const BlockFields = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

export const BlockField = styled.label`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;
`

export const ColorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

export const ColorButton = styled.button<{
  color?: string
  isActive: boolean
}>`
  background: ${(props) => props.color};
  box-shadow: ${(props) => (props.isActive ? '0 0 1px 1px #000' : 'none')};
  height: ${(props) => props.theme.grid.unit * 3}px;
  width: ${(props) => props.theme.grid.unit * 3}px;
  border-radius: 50%;
  margin: 2px;
  padding: 0;
  border: 1px solid ${(props) => props.theme.colors.border.tertiary};
  cursor: pointer;
  flex-shrink: 0;

  /*  &:focus {
    outline: none;
  }*/
`
