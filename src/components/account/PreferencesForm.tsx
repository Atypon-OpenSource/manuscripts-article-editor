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

import { Form, FormikProps } from 'formik'
import React from 'react'
import styled from 'styled-components'

import { Languages } from '../../lib/preferences'

const LocaleSelectorLabel = styled.label`
  display: block;
  margin-top: 20px;
`

const LocaleSelector = styled.select`
  width: auto;
  margin-left: 1ch;
`

const locales = new Map<Languages, string>([
  ['en', 'English'],
  ['ar', 'Arabic'],
  // ['zh', 'Chinese'],
])

export interface PreferencesValues {
  locale: Languages
}

export interface PreferencesErrors {
  locale?: string
  // submit?: {}
}

export const PreferencesForm: React.FunctionComponent<
  FormikProps<PreferencesValues & PreferencesErrors>
> = ({ values, errors, handleBlur, handleChange }) => (
  <Form>
    <LocaleSelectorLabel>
      Locale
      <LocaleSelector
        name={'locale'}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.locale}
        required={true}
      >
        {Array.from(locales).map(([locale, localeName]) => (
          <option key={locale} value={locale}>
            {localeName}
          </option>
        ))}
      </LocaleSelector>
    </LocaleSelectorLabel>

    {Object.entries(errors).map(([field, message]) => (
      <div key={field}>{message}</div>
    ))}
  </Form>
)
