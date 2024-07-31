/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { SectionCategory } from '@manuscripts/json-schema'
import { SectionNode } from '@manuscripts/transform'

export const uneditableSectionCategories: string[] = [
  'MPSectionCategory:bibliography',
  'MPSectionCategory:keywords',
  'MPSectionCategory:list-of-figures',
  'MPSectionCategory:list-of-tables',
  'MPSectionCategory:toc',
]

export const uniqueSectionCategories: string[] = [
  'MPSectionCategory:abstract-graphical',
  'MPSectionCategory:abstract',
]

export const isEditableSectionCategoryID = (id: string) =>
  !uneditableSectionCategories.includes(id)

export const isEditableSectionCategory = (sectionCategory: SectionCategory) =>
  isEditableSectionCategoryID(sectionCategory._id)

export const sortSectionCategories = (sectionCategories: SectionCategory[]) =>
  sectionCategories.sort((a, b) => a.priority - b.priority)

export const chooseSectionCategory = (
  section: SectionNode,
  isSubSection?: boolean
): string => {
  if (section.attrs.category) {
    return section.attrs.category
  }

  return isSubSection
    ? 'MPSectionCategory:subsection'
    : 'MPSectionCategory:section'
}

export const isUnique = (categoryId: string) => {
  return uniqueSectionCategories.includes(categoryId)
}

export const isUniqueCurrent = (
  categoryId: string,
  currentCategoryId: string
) => {
  return categoryId === currentCategoryId
}

export const isUniquePresent = (
  cat: SectionCategory,
  existingCats: { [key: string]: number }
) => {
  return isUnique(cat._id) && Object.keys(existingCats).includes(cat._id)
}
