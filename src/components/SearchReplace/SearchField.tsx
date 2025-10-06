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

import { TextField } from '@manuscripts/style-guide'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

export const SearchField: React.FC<{
  setNewSearchValue: (val: string) => void
  value: string
  current: number
  total: number
  onInputFocus: () => void
}> = ({ setNewSearchValue, value, current, total, onInputFocus }) => {
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    input.current?.focus()
  }, [])

  return (
    <FieldWrapper>
      <TextField
        onChange={(e) => {
          setNewSearchValue(e.target.value)
        }}
        autoComplete="off"
        role="searchbox"
        value={value}
        spellCheck={false}
        placeholder={'Find in document'}
        aria-label="Find in document"
        onFocus={() => onInputFocus()}
        type="text"
        ref={input}
      />
      {value && (
        <Counter>
          {total === 0 ? 0 : Math.max(1, current + 1)} of {total}
        </Counter>
      )}
    </FieldWrapper>
  )
}

const FieldWrapper = styled(TextField.withComponent('div'))`
  position: relative;
  display: flex;
  padding: 0;
  align-items: center;
  max-width: 280px;
  ${TextField} {
    border: none;
  }
  &:focus-within {
    border-color: ${(props) => props.theme.colors.border.field.hover};
    background-color: ${(props) => props.theme.colors.background.fifth};
  }
`

const Counter = styled.div`
  color: #ccc;
  line-height: 1;
  flex: 1 0 auto;
  padding: 0 16px 0 8px;
  pointer-events: none;
`
