import { FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader, FormLink } from './Form'
import { Hero, SubHero } from './Hero'
import { TextField } from './TextField'

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

    <TextField
      type={'text'}
      name={'name'}
      label={'Name'}
      placeholder={'name'}
      autoFocus={true}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.name}
      required={true}
      position={'first'}
      isInvalid={touched.name && Boolean(errors.name)}
    />

    <TextField
      type={'text'}
      name={'surname'}
      label={'Surname'}
      placeholder={'surname'}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.surname}
      required={true}
      position={'last'}
      isInvalid={touched.surname && Boolean(errors.surname)}
    />

    <TextField
      type={'email'}
      name={'email'}
      label={'Email address'}
      placeholder={'email'}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.email}
      required={true}
      position={'first'}
      isInvalid={touched.email && Boolean(errors.email)}
    />

    <TextField
      type={'password'}
      name={'password'}
      label={'Password'}
      placeholder={'password'}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.password}
      required={true}
      position={'last'}
    />

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
