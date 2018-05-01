import { FormikErrors, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader } from './Form'
import { SubHero } from './Hero'
import { TextField } from './TextField'

export interface PasswordValues {
  password: string
}

export interface PasswordHiddenValues {
  token: string
}

export interface ResetPasswordResponse {
  token: string
}

export interface PasswordErrors extends FormikErrors<PasswordValues> {
  submit?: string
  unauthorized?: string
}

type FormProps = FormikProps<PasswordValues & PasswordErrors>

export const PasswordForm: React.SFC<FormProps> = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
}) => (
  <CenteredForm onSubmit={handleSubmit}>
    <FormHeader>
      <SubHero>Choose a new password</SubHero>
    </FormHeader>

    <TextField
      type={'password'}
      name={'password'}
      autoFocus={true}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.password}
      required={true}
      autoComplete={'new-password'}
    />

    {errors.submit && <div>{errors.submit}</div>}

    <FormActions>
      <div />
      <div>
        <PrimaryButton
          type={'submit'}
          // disabled={isSubmitting || !isValid}
        >
          Save Password
        </PrimaryButton>
      </div>
    </FormActions>
  </CenteredForm>
)
