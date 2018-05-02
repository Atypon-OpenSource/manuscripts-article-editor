import { FormikErrors, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader, FormLink } from './Form'
import { Hero, SubHero } from './Hero'
import { TextField, TextFieldGroup } from './TextField'

export interface SignupValues {
  name: string
  email: string
  password: string
}

export interface SignupErrors extends FormikErrors<SignupValues> {
  submit?: string
}

export const SignupForm = ({
  values,
  touched,
  errors,
  dirty,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
}: FormikProps<SignupValues & SignupErrors>) => (
  <CenteredForm onSubmit={handleSubmit}>
    <FormHeader>
      <SubHero>Manuscripts Online</SubHero>
      <Hero>Sign Up</Hero>
    </FormHeader>

    <TextFieldGroup>
      <TextField
        type={'text'}
        name={'name'}
        placeholder={'name'}
        autoFocus={true}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
        required={true}
        autoComplete={'name'}
      />
    </TextFieldGroup>

    <TextFieldGroup>
      <TextField
        type={'email'}
        name={'email'}
        placeholder={'email'}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
        required={true}
        autoComplete={'username email'}
      />

      <TextField
        type={'password'}
        name={'password'}
        placeholder={'password'}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
        required={true}
        autoComplete={'new-password'}
      />
    </TextFieldGroup>

    {dirty && touched.email && errors.email && <div>{errors.email}</div>}
    {dirty &&
      touched.password &&
      errors.password && <div>{errors.password}</div>}

    {errors.submit && <div>{errors.submit}</div>}

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
