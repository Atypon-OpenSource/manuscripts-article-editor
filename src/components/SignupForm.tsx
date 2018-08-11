import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from './Button'
import {
  CenteredForm,
  FormActions,
  FormError,
  FormHeader,
  FormLink,
} from './Form'
import { Hero, SubHero } from './Hero'
import { TextField } from './TextField'
import { TextFieldGroupContainer } from './TextFieldGroupContainer'

export interface SignupValues {
  name: string
  email: string
  password: string
  allowsTracking: boolean
}

export interface SignupErrors {
  submit?: string
}

export const SignupForm: React.SFC<
  FormikProps<SignupValues & SignupErrors>
> = ({ errors, isSubmitting }) => (
  <CenteredForm id={'signup-form'} noValidate={true}>
    <FormHeader>
      <SubHero>Manuscripts Online</SubHero>
      <Hero>Sign Up</Hero>
    </FormHeader>

    <TextFieldGroupContainer
      errors={{
        name: errors.name,
      }}
    >
      <Field name={'name'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'text'}
            placeholder={'name'}
            required={true}
            autoComplete={'name'}
            error={errors.name as string}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    <TextFieldGroupContainer
      errors={{
        email: errors.email,
        password: errors.password,
      }}
    >
      <Field name={'email'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'email'}
            placeholder={'email'}
            required={true}
            autoComplete={'username email'}
          />
        )}
      </Field>

      <Field name={'password'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'password'}
            placeholder={'password'}
            required={true}
            autoComplete={'new-password'}
            error={errors.password as string}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    <FormActions>
      <Field name={'allowsTracking'}>
        {({ field }: FieldProps) => (
          <label>
            <input {...field} type={'checkbox'} />
            Allow tracking usage to help improve service.
          </label>
        )}
      </Field>
    </FormActions>

    {errors.submit && (
      <FormError className="form-error">{errors.submit}</FormError>
    )}

    <FormActions>
      <div>
        Have an account? <FormLink to={'/login'}>Sign In</FormLink>
      </div>

      <PrimaryButton type={'submit'} disabled={isSubmitting}>
        Sign up
      </PrimaryButton>
    </FormActions>
  </CenteredForm>
)
