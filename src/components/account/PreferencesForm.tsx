/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Form, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'

const LocaleSelectorLabel = styled.label`
  display: block;
  margin-top: 20px;
`

const LocaleSelector = styled.select`
  width: auto;
  margin-left: 1ch;
`

const locales = new Map([
  ['en', 'English'],
  ['ar', 'Arabic'],
  ['zh', 'Chinese'],
])

export interface PreferencesValues {
  locale: string
}

export interface PreferencesErrors {
  locale?: string
  submit?: {}
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
