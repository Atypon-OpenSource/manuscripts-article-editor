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
import { RichText } from '@manuscripts/style-guide'
import { schema, SectionNode, TitleNode } from '@manuscripts/transform'
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
  section: SectionNode
  state: EditorState
}> = ({ dispatchNodeAttrs, section, state }) => {
  const [{ sectionCategories, doc }] = useStore((store) => ({
    doc: store.doc,
    sectionCategories: sortSectionCategories(store.sectionCategories),
  }))

  const title = useMemo(() => {
    let titleText = ''
    section.descendants((n) => {
      if (n.type === schema.nodes.title) {
        titleText = (n as TitleNode).text || ''
        return true
      }
    })
    return titleText
  }, [section])

  const [existingCatsCounted, isSubSection] = useMemo(() => {
    let isSubSection = false
    const exisitingCats: { [key: string]: number } = {}

    doc.descendants((node, _, nodeParent) => {
      if (node.type === schema.nodes.section) {
        if (nodeParent?.type === schema.nodes.section && node.eq(section)) {
          isSubSection = true
        }

        const currentSection = node as SectionNode
        const cat = currentSection.attrs.category
        if (cat && cat.startsWith('MPSectionCategory:')) {
          // @TODO - check this part - cat.startsWith('MPSectionCategory:')
          exisitingCats[cat] = exisitingCats[cat] ? exisitingCats[cat]++ : 1
        }
      }
    })

    return [exisitingCats, isSubSection]
  }, [doc]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const currentSectionCategory = chooseSectionCategory(section, isSubSection)

  return (
    <InspectorSection title={'Section'}>
      {title && <SectionTitle value={title} />}

      {isEditableSectionCategoryID(currentSectionCategory) && (
        <>
          <Subheading>Category</Subheading>

          <CategoryInput
            value={currentSectionCategory}
            sectionCategories={sortedSectionCategories}
            existingCatsCounted={existingCatsCounted}
            handleChange={(category: string) => {
              dispatchNodeAttrs(section.attrs.id, { category })
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
