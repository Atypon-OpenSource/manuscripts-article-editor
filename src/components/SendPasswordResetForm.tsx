import { FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader } from './Form'
import { SubHero } from './Hero'
import { TextField } from './TextField'

export interface SendPasswordResetValues {
  email: string
}

export interface SendPasswordResetErrors
  extends FormikErrors<SendPasswordResetValues> {
  notFound: string
  submit: string
}

export const SendPasswordResetForm = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
}: FormikProps<SendPasswordResetValues & SendPasswordResetErrors>) => (
  <CenteredForm onSubmit={handleSubmit}>
    <FormHeader>
      <SubHero>Reset Password</SubHero>
    </FormHeader>

    <TextField
      type={'email'}
      name={'email'}
      placeholder={'email'}
      autoFocus={true}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.email}
      required={true}
    />

    {/*{touched.email && errors.email && <div>{errors.email}</div>}*/}

    {errors.notFound && <div>Email address not found</div>}

    {errors.submit && <div>{errors.submit}</div>}

    <FormActions>
      <div />
      <div>
        <PrimaryButton
          type={'submit'}
          // disabled={isSubmitting || !isValid}
        >
          Send password reset
        </PrimaryButton>
      </div>
    </FormActions>
  </CenteredForm>
)
