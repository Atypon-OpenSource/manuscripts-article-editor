import { FormikErrors, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader } from './Form'
import { SubHero } from './Hero'
import { TextField } from './TextField'

export interface RecoverValues {
  email: string
}

export interface RecoverErrors extends FormikErrors<RecoverValues> {
  notFound: string
  submit: string
}

type FormProps = FormikProps<RecoverValues & RecoverErrors>

export const RecoverForm: React.SFC<FormProps> = ({
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
      autoComplete={'username email'}
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
