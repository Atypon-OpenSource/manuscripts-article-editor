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

import {
  PAGE_BREAK_AFTER,
  PAGE_BREAK_BEFORE,
  PAGE_BREAK_BEFORE_AND_AFTER,
  PAGE_BREAK_NONE,
} from '@manuscripts/manuscript-transform'
import React, { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'

import { useSyncedData } from '../../hooks/use-synced-data'

export const PageBreakInput: React.FC<{
  value?: number
  handleChange: (style: number) => void
}> = ({ value = PAGE_BREAK_NONE, handleChange }) => {
  const [currentValue, handleLocalChange] = useSyncedData<number>(
    value,
    handleChange,
    500
  )

  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      handleLocalChange(Number(event.target.value || PAGE_BREAK_NONE))
    },
    [handleLocalChange]
  )

  return (
    <Selector value={currentValue} onChange={handleValueChange}>
      <option value={PAGE_BREAK_NONE}>None</option>
      <option value={PAGE_BREAK_BEFORE}>Break before</option>
      <option value={PAGE_BREAK_AFTER}>Break after</option>
      <option value={PAGE_BREAK_BEFORE_AND_AFTER}>
        Break before and after
      </option>
    </Selector>
  )
}

const Selector = styled.select`
  display: block;
  width: 100%;
`
