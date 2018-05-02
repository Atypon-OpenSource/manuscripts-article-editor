import { FormikErrors, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../theme'
import {
  ModalContainer,
  ModalForm,
  ModalFormActions,
  ModalFormBody,
  ModalFormFooter,
  ModalHeader,
  ModalHeading,
  ModalMain,
  PrimaryModalFooterButton,
} from './Manage'
import { PreferencesMessage } from './Messages'

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

export interface PreferencesErrors extends FormikErrors<PreferencesValues> {
  locale?: string
  submit?: {}
}

export const PreferencesForm = ({
  values,
  touched,
  errors,
  dirty,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
}: FormikProps<PreferencesValues & PreferencesErrors>) => (
  <form onSubmit={handleSubmit}>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>
          <PreferencesMessage />
        </ModalHeading>
      </ModalHeader>
      <ModalForm>
        <ModalFormBody>
          <ModalMain>
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
          </ModalMain>
        </ModalFormBody>

        <ModalFormFooter>
          <ModalFormActions>
            <PrimaryModalFooterButton type={'submit'}>
              Done
            </PrimaryModalFooterButton>
          </ModalFormActions>
        </ModalFormFooter>
      </ModalForm>
    </ModalContainer>
  </form>
)
