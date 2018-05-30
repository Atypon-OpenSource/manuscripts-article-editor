import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader } from './Form'
import { SubHero } from './Hero'
import { TextField } from './TextField'

export interface RecoverValues {
  email: string
}

export interface RecoverErrors {
  notFound: string
  submit: string
}

export const RecoverForm: React.SFC<
  FormikProps<RecoverValues & RecoverErrors>
> = ({
  values,
  touched,
  errors,
  // isSubmitting,
  // isValid,
}) => (
  <CenteredForm>
    <FormHeader>
      <SubHero>Reset Password</SubHero>
    </FormHeader>

    <Field name={'email'}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          type={'email'}
          placeholder={'email'}
          autoFocus={true}
          required={true}
          autoComplete={'username email'}
        />
      )}
    </Field>

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
