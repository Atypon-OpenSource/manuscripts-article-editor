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
import React, { useCallback, useMemo } from 'react'
import Select, { OptionProps } from 'react-select'
import styled from 'styled-components'
import { findChildrenByAttr, findChildrenByType } from 'prosemirror-utils'
import { useSyncedData } from '../../hooks/use-synced-data'
import {
  isBackMatterSection,
  isEditableSectionCategory,
  isBackMatterSectionCategoryExist,
  isUniqueCurrent,
  isUniquePresent,
} from '../../lib/section-categories'
import { OptionWrapper } from './TagsInput'
import { useStore } from '../../store'
import { schema } from '@manuscripts/transform'

type OptionType = {
  value: string
  label: string
  isDisabled: boolean
}
  
const [{ doc }] = useStore((state) => ({
  doc: state.doc,
}))

export const CategoryInput: React.FC<{
  value: string
  sectionCategories: SectionCategory[]
  handleChange: (category: string) => void
  existingCatsCounted: { [key: string]: number }
}> = ({ value, handleChange, existingCatsCounted, sectionCategories }) => {
  const [currentValue, handleLocalChange] = useSyncedData<string>(
    value,
    handleChange,
    0
  )

  const handleInputChange = useCallback(
    (newValue) => handleLocalChange(newValue.value),
    [handleLocalChange]
  )

  const OptionComponent: React.FC<OptionProps<OptionType, true>> = ({
    innerProps,
    data,
  }) => {
    return (
      <OptionWrapper {...innerProps} isDisabled={data.isDisabled} ref={null}>
        {data.label}
      </OptionWrapper>
    )
  }

  const options = useMemo(() => {
    const backmatter = findChildrenByType(doc, schema.nodes.backmatter)[0]
    const options: OptionType[] = []
    sectionCategories.map((cat) => {
      // check if the category is part of the backmatter section, and its already present in the document
      let isDisabled = false
      if (
        cat.groupIDs &&
        isBackMatterSection(cat.groupIDs[0]) &&
        isBackMatterSectionCategoryExist(backmatter.node, cat._id)
      ) {
        isDisabled = true
      }
      if (
        isEditableSectionCategory(cat) &&
        (!isUniquePresent(cat, existingCatsCounted) ||
          isUniqueCurrent(cat._id, currentValue))
      ) {
        options.push({
          value: cat._id,
          label: cat.name,
          isDisabled: isDisabled,
        })
      }
    })
    return options
  }, [currentValue, existingCatsCounted, sectionCategories])

  const selectionValue = useMemo(() => {
    const cat = sectionCategories.find(
      (category) => category._id === currentValue
    )
    return cat && { value: cat._id, label: cat.name, isDisabled: false }
  }, [currentValue, sectionCategories])
  return (
    <Container>
      <Select<OptionType, true>
        value={selectionValue}
        options={options}
        menuPortalTarget={document.body}
        onChange={handleInputChange}
        maxMenuHeight={150}
        components={{
          Option: OptionComponent,
        }}
      />
    </Container>
  )
}

const Container = styled.div`
  height: ${(props) => props.theme.grid.unit * 30}px;
`
