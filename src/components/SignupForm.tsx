import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from './Button'
import {
  buildError,
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
}

export interface SignupErrors {
  submit?: string
}

export const SignupForm: React.SFC<
  FormikProps<SignupValues & SignupErrors>
> = ({
  touched,
  errors,
  dirty,
  // isSubmitting,
  // isValid,
}) => (
  <CenteredForm>
    <FormHeader>
      <SubHero>Manuscripts Online</SubHero>
      <Hero>Sign Up</Hero>
    </FormHeader>

    <TextFieldGroupContainer
      errors={{
        name: buildError(dirty, touched.name as boolean, errors.name as string),
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
        email: buildError(
          dirty,
          touched.email as boolean,
          errors.email as string
        ),
        password: buildError(
          dirty,
          touched.password as boolean,
          errors.password as string
        ),
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
            error={errors.email as string}
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

    {errors.submit && <FormError>{errors.submit}</FormError>}

    <FormActions>
      <div>
        Have an account? <FormLink to={'/login'}>Sign In</FormLink>
      </div>

      <PrimaryButton
        type={'submit'}
        // disabled={isSubmitting || !isValid}
      >
        Sign up
      </PrimaryButton>
    </FormActions>
  </CenteredForm>
)
