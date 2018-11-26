import { Form, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme'

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
