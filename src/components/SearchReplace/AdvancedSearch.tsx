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
  CheckboxField,
  CheckboxLabel,
  CloseButton,
  DraggableModal,
  ModalHeader,
  PrimaryButton,
  SecondaryButton,
  TextField,
  TextFieldLabel,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { SearchField } from './SearchField'

export const Advanced: React.FC<{
  isOpen: boolean
  handleClose: () => void
  setNewSearchValue: (val: string) => void
  value: string
  replaceAll: () => void
  replaceCurrent: () => void
  moveNext: () => void
  movePrev: () => void
  setReplaceValue: (value: string) => void
  current: number
  total: number
  caseSensitive: boolean
  ignoreDiacritics: boolean
  setCaseSensitive: (val: boolean) => void
  setIgnoreDiacritics: (val: boolean) => void
  onInputFocus: () => void
}> = ({
  isOpen,
  handleClose,
  setNewSearchValue,
  value,
  movePrev,
  moveNext,
  replaceAll,
  replaceCurrent,
  setReplaceValue,
  total,
  current,
  caseSensitive,
  setCaseSensitive,
  ignoreDiacritics,
  setIgnoreDiacritics,
  onInputBlur,
  onInputFocus,
}) => (
  <>
    <DraggableModal isOpen={isOpen} onRequestClose={() => handleClose()}>
      <ModalHeader>
        <CloseButton
          onClick={() => handleClose()}
          data-cy="modal-close-button"
        />
      </ModalHeader>
      <SearchForm>
        <h3>Find and Replace</h3>
        <FieldGroup>
          <Label>Find</Label>
          <SearchField
            value={value}
            onInputBlur={() => onInputBlur()}
            onInputFocus={() => onInputFocus()}
            total={total}
            current={current}
            setNewSearchValue={setNewSearchValue}
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Replace With</Label>
          <TextField
            onChange={(e) => {
              setReplaceValue(e.target.value)
            }}
            autoComplete="off"
            role="searchbox"
            spellCheck={false}
            placeholder={'Replace with'}
            aria-label="Replace with"
            type={'text'}
          />
        </FieldGroup>
        <OptionsGroup>
          <CheckBoxGroup>
            <CheckboxField
              id="caseSensitive"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            <CheckBoxLabelSpaced htmlFor="caseSensitive">
              Match case
            </CheckBoxLabelSpaced>
          </CheckBoxGroup>
          <CheckBoxGroup>
            <CheckboxField
              id="ignoreDiacritics"
              checked={ignoreDiacritics}
              onChange={(e) => setIgnoreDiacritics(e.target.checked)}
            />
            <CheckBoxLabelSpaced htmlFor="ignoreDiacritics">
              Ignore diacritics (e.g. ä = a, E = É, אַ = א)
            </CheckBoxLabelSpaced>
          </CheckBoxGroup>
        </OptionsGroup>
        <ButtonsSection>
          <SecondaryButton onClick={() => replaceCurrent()}>
            Replace
          </SecondaryButton>
          <SecondaryButton onClick={() => replaceAll()}>
            Replace All
          </SecondaryButton>
          <PrimaryButton onClick={() => movePrev()}>Previous</PrimaryButton>
          <PrimaryButton onClick={() => moveNext()}>Next</PrimaryButton>
        </ButtonsSection>
      </SearchForm>
    </DraggableModal>
  </>
)

const CheckBoxLabelSpaced = styled(CheckboxLabel)`
  margin-left: 0.5rem;
`

const CheckBoxGroup = styled.div`
  margin: 0.5rem 0;
`

const OptionsGroup = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 350px;
  margin: 0.5rem 0 2.5rem auto;
`

const FieldGroup = styled.div`
  display: flex;
  margin-bottom: 2rem;
  align-items: center;
  justify-content: space-between;
  & > input {
    max-width: 350px;
  }
`

const Label = styled(TextFieldLabel)`
  text-transform: none;
`

const ButtonsSection = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    min-width: 100px;
  }
`
const SearchForm = styled.div`
  min-width: 465px;
  max-width: 100%;
`
