import { FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader, FormLink } from './Form'
import { Hero, SubHero } from './Hero'
import { FirstTextField, LastTextField } from './TextField'

export interface SignupValues {
  name: string
  surname: string
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

    <FirstTextField
      type={'text'}
      name={'name'}
      placeholder={'name'}
      autoFocus={true}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.name}
      required={true}
    />

    <LastTextField
      type={'text'}
      name={'surname'}
      placeholder={'surname'}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.surname}
      required={true}
    />

    <FirstTextField
      type={'email'}
      name={'email'}
      placeholder={'email'}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.email}
      required={true}
    />

    <LastTextField
      type={'password'}
      name={'password'}
      placeholder={'password'}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.password}
      required={true}
    />

    {touched.email && errors.email && <div>{errors.email}</div>}
    {touched.password && errors.password && <div>{errors.password}</div>}

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
