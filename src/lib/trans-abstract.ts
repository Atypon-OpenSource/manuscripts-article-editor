/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2026 Atypon Systems LLC. All Rights Reserved.
 */
import { ManuscriptNode } from '@manuscripts/transform'

export const TRANS_ABSTRACT_DISPLAY_NAME = 'Trans Abstract'

export const TRANSLATED_GRAPHICAL_ABSTRACT_CATEGORY_LABELS: Record<
  string,
  string
> = {
  'abstract-graphical': 'Trans Graphical Abstract',
  'abstract-key-image': 'Trans Key Image',
}

export const getTransAbstractDisplayName = (_node: ManuscriptNode): string => {
  return TRANS_ABSTRACT_DISPLAY_NAME
}

export const getTransGraphicalAbstractDisplayName = (
  node: ManuscriptNode
): string => {
  const category = node.attrs.category as string | undefined
  return (
    (category && TRANSLATED_GRAPHICAL_ABSTRACT_CATEGORY_LABELS[category]) ||
    'Trans Graphical Abstract'
  )
}
