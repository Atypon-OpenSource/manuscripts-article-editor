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
import { Section } from '@manuscripts/json-schema'
import { RichText } from '@manuscripts/style-guide'
import { SectionNode } from '@manuscripts/transform'
import { EditorState, Transaction } from 'prosemirror-state'
import { findParentNode } from 'prosemirror-utils'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import {
  chooseSectionCategory,
  isEditableSectionCategoryID,
  sortSectionCategories,
} from '../../lib/section-categories'
import { useStore } from '../../store'
import { InspectorSection, Subheading } from '../InspectorSection'
import { CategoryInput } from '../projects/CategoryInput'

export const SectionInspector: React.FC<{
  dispatchNodeAttrs: (
    id: string,
    attrs: Record<string, unknown>,
    nodispatch?: boolean
  ) => Transaction | undefined
  section: Section
  sectionNode?: SectionNode
  state: EditorState
  dispatch: (tr: Transaction) => EditorState | void
}> = ({ dispatchNodeAttrs, section, sectionNode, state, dispatch }) => {
  const [{ modelMap, sectionCategories }] = useStore((store) => ({
    modelMap: store.trackModelMap,
    sectionCategories: sortSectionCategories(store.sectionCategories),
  }))

  const existingCatsCounted = useMemo(() => {
    const exisitingCats: { [key: string]: number } = {}
    for (const model of modelMap) {
      const section = model[1] as Section
      if (
        section.category &&
        section.category.startsWith('MPSectionCategory:')
      ) {
        exisitingCats[section.category] = exisitingCats[section.category]
          ? exisitingCats[section.category]++
          : 1
      }
      // section.category == 'MPSectionCategory:abstract-graphical'
    }
    return exisitingCats
  }, [modelMap.size]) // eslint-disable-line react-hooks/exhaustive-deps

  const sortedSectionCategories = useMemo(() => {
    const container = findParentNode((node) => node.attrs.category)(
      state.selection
    )?.node

    if (!container) {
      return []
    }

    const sectionCategory = sectionCategories.find(
      ({ _id }) => _id === container.attrs.category
    )

    if (!sectionCategory) {
      return []
    }

    return sectionCategories.filter(
      ({ groupIDs }) =>
        groupIDs &&
        groupIDs.some((groupID) => sectionCategory.groupIDs?.includes(groupID))
    )
  }, [sectionCategories, state.selection])

  const currentSectionCategory = chooseSectionCategory(section)
  return (
    <InspectorSection title={'Section'}>
      {section.title && <SectionTitle value={section.title} />}

      {isEditableSectionCategoryID(currentSectionCategory) && (
        <>
          <Subheading>Category</Subheading>

          <CategoryInput
            value={currentSectionCategory}
            sectionCategories={sortedSectionCategories}
            existingCatsCounted={existingCatsCounted}
            handleChange={(category: string) => {
              dispatchNodeAttrs(section._id, { category })
            }}
          />
        </>
      )}
    </InspectorSection>
  )
}

const SectionTitle = styled(RichText)`
  color: ${(props) => props.theme.colors.text.primary};
  margin: 4px 0;
`
