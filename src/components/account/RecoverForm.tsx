import { PrimarySubmitButton } from '@manuscripts/style-guide'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { CenteredForm, FormActions, FormHeader } from '../Form'
import { SubHero } from '../Hero'
import { TextField } from '../TextField'

export interface RecoverValues {
  email: string
}

export interface RecoverErrors {
  notFound: string
  submit: string
}

export const RecoverForm: React.FunctionComponent<
  FormikProps<RecoverValues & RecoverErrors>
> = ({ values, errors, isSubmitting }) => (
  <CenteredForm noValidate={true}>
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
        <PrimarySubmitButton disabled={isSubmitting}>
          Send password reset
        </PrimarySubmitButton>
      </div>
    </FormActions>
  </CenteredForm>
)
