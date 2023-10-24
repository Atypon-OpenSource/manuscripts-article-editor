/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */

import {
  BibliographicDate,
  BibliographicName,
  Model,
} from '@manuscripts/json-schema'
import { bibliographyItemTypes } from '@manuscripts/library'
import { NodeAttrChange } from '@manuscripts/track-changes-plugin'

/**
 * Filter PN node attributes to show for comparing them with old change
 * @param attrsChange
 */
export const filterAttrsChange = (attrsChange: NodeAttrChange) => {
  // TODO:: use attrsChange.nodeType when adding filter for other nodes
  return {
    newAttrs: bibliographyAttrsFilter(attrsChange.newAttrs),
    oldAttrs: bibliographyAttrsFilter(attrsChange.oldAttrs),
  }
}

const bibliographyAttrsFilter = (
  attrs: Record<string, Model | Model[] | string>
) => {
  const filteredAttrs: Record<string, { label: string; value: string }> = {}
  const excludedKeys = ['id', 'paragraphStyle']
  const getLabel = (key: string) =>
    key.replace(/(^\w{1})|(\+s\w{1})/g, (letter) => letter.toUpperCase())

  Object.entries(attrs)
    .filter(([key]) => !excludedKeys.includes(key))
    .map(([key, value]) => {
      switch (key) {
        case 'type':
          return (filteredAttrs[key] = {
            label: getLabel(key),
            value:
              bibliographyItemTypes.get(value as CSL.ItemType) ||
              (value as string),
          })
        case 'author':
          return (filteredAttrs[key] = {
            label: getLabel(key),
            value: (value as BibliographicName[])
              ?.map((name) =>
                name.given && name.family ? `${name.given} ${name.family}` : ''
              )
              .join(', '),
          })
        case 'issued':
          return (filteredAttrs[key] = {
            label: getLabel(key),
            value: ((value as BibliographicDate)?.['date-parts'] || []).join(
              '/'
            ),
          })
        case 'containerTitle':
          return (filteredAttrs[key] = {
            label: 'Container Title',
            value: value as string,
          })
        default:
          return (filteredAttrs[key] = {
            label: getLabel(key),
            value: value as string,
          })
      }
    })

  return filteredAttrs
}
