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

import { bibliographyItemTypes, FileAttachment } from '@manuscripts/body-editor'
import { NodeAttrChange } from '@manuscripts/track-changes-plugin'
import {
  AffiliationNode,
  BibliographyItemNode,
  CreditRole,
  FootnoteNode,
  isCitationNode,
  isInlineFootnoteNode,
  ManuscriptNode,
} from '@manuscripts/transform'

const bibliographyItemTypeMap = new Map(bibliographyItemTypes)

/**
 * Filter PN node attributes to show for comparing them with old change
 * @param attrsChange
 */
export const filterAttrsChange = (
  modelOfChange: ManuscriptNode,
  attrsChange: NodeAttrChange,
  files: FileAttachment[],
  affiliations: AffiliationNode[],
  references: BibliographyItemNode[],
  footnotes: FootnoteNode[]
) => {
  // TODO:: use attrsChange.nodeType when adding filter for other nodes
  return {
    newAttrs: createAttrsDisplay(
      modelOfChange,
      attrsChange.newAttrs,
      files,
      affiliations,
      references,
      footnotes
    ),
    oldAttrs: createAttrsDisplay(
      modelOfChange,
      attrsChange.oldAttrs,
      files,
      affiliations,
      references,
      footnotes
    ),
  }
}

function displayPerson(person: CSL.Person) {
  return person && person.given && person.family ? `${person.given} ${person.family}` : ''
}

const getLabel = (key: string) =>
  key.replace(/[a-z][A-Z,0-9]|^./g, (match) => {
    if (match.length == 1) {
      return match.toUpperCase()
    } else {
      const res = match.split('')
      res.splice(match.length - 1, 0, ' ')

      return res.join('')
    }
  })

const createAttrsDisplay = (
  modelOfChange: ManuscriptNode,
  attrs: Record<string, any>,
  files: FileAttachment[],
  affiliations: AffiliationNode[],
  references: BibliographyItemNode[],
  footnotes: FootnoteNode[]
) => {
  const filteredAttrs: Record<string, { label: string; value: string }> = {}
  const excludedKeys = ['id', 'paragraphStyle', 'dataTracked']

  Object.entries(attrs)
    .filter(([key]) => !excludedKeys.includes(key))
    .map(([key, value]) => {
      switch (key) {
        case 'type':
          return (filteredAttrs[key] = {
            label: getLabel(key),
            value: bibliographyItemTypeMap.get(value) || (value as string),
          })

        case 'rids':
          if (isInlineFootnoteNode(modelOfChange)) {
            const limit = 50
            filteredAttrs[key] = {
              label: 'Footnote',
              value: footnotes.reduce((acc, fn) => {
                const rids = value as string[]
                if (rids.includes(fn.attrs.id)) {
                  const fnText =
                    fn.textContent?.substring(0, limit) +
                    (fn.textContent && fn.textContent.length > limit
                      ? '...'
                      : '')
                  return acc ? acc + ', ' + fnText : fnText
                }
                return acc
              }, ''),
            }
          }

          if (isCitationNode(modelOfChange)) {
            filteredAttrs[key] = {
              label: 'Reference',
              value: references.reduce((acc, ref) => {
                const rids = value as string[]
                if (rids.includes(ref.attrs.id)) {
                  const refText = ref.attrs.title || ref.attrs.DOI || ''
                  return acc ? acc + ', \n' + refText : refText
                }

                return acc
              }, ''),
            }
          }

          return
        case 'affiliationIDs':
          return (filteredAttrs[key] = {
            label: getLabel(key),
            value: (value as string[])
              ?.map((id) => {
                const affiliation = affiliations.find(
                  (aff) => aff.attrs.id === id
                )
                return affiliation?.attrs.institution || 'Unknown'
              })
              .join(', '),
          })

        case 'author':
          return (filteredAttrs[key] = {
            label: getLabel(key),
            value: (value as CSL.Person[])
              ?.map(displayPerson)
              .join(', '),
          })

        case 'creditRoles':
          return (filteredAttrs[key] = {
            label: 'CRediT Role',
            value: Array.isArray(value)
              ? (value as CreditRole[]).map((r) => r.vocabTerm).join(', ')
              : '',
          })
        case 'src':
          return (filteredAttrs[key] = {
            label: 'File',
            value: files.find((f) => f.id === value)?.name || (value as string),
          })
        case 'extLink':
          return (filteredAttrs[key] = {
            label: 'Linked File',
            value: files.find((f) => f.id === value)?.name || (value as string),
          })
        case 'issued':
          return (filteredAttrs[key] = {
            label: 'year',
            value: (value?.['date-parts'] || []).join('/'),
          })
        case 'containerTitle':
          return (filteredAttrs[key] = {
            label: 'Container Title',
            value: value as string,
          })
        case 'isCorresponding':
          return (filteredAttrs[key] = {
            label: 'Corresponding Author',
            value: value ? 'Yes' : 'No',
          })
        case 'addressLine1':
          filteredAttrs[key] = {
            label: 'Street Address',
            value: value as string,
          }
          return
        case 'institution':
          filteredAttrs[key] = {
            label: 'Institution Name',
            value: value as string,
          }
          return

        case 'priority':
          // show the value of priority only if it's a number
          if (typeof value === 'number') {
            filteredAttrs[key] = {
              label: 'Author reordered',
              value: String(value),
            }
          }
          return

        default:
          return (filteredAttrs[key] = {
            label: getLabel(key),
            value: value as string,
          })
      }
    })

  return filteredAttrs
}
