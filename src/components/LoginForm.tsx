import * as React from 'react'

import { FormikErrors, FormikProps } from 'formik'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader, FormLink } from './Form'
import { Hero, SubHero } from './Hero'
import { TextField } from './TextField'

export interface LoginValues {
  email: string
  password: string
}

export interface LoginErrors extends FormikErrors<LoginValues> {
  unauthorized: boolean
  submit: string
}

export const LoginForm = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
}: FormikProps<LoginValues & LoginErrors>) => (
  <CenteredForm onSubmit={handleSubmit}>
    <FormHeader>
      <SubHero>Welcome to</SubHero>
      <Hero>Manuscripts Online</Hero>
    </FormHeader>

    <TextField
      type={'email'}
      name={'email'}
      label={'Email'}
      placeholder={'email'}
      autoFocus={true}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.email}
      required={true}
      position={'first'}
      isInvalid={touched.email && Boolean(errors.email)}
    />

    {/*{touched.email && errors.email && <div>{errors.email}</div>}*/}

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

    {/*{touched.password && errors.password && <div>{errors.password}</div>}*/}

    {errors.unauthorized && <div>Username or password is incorrect</div>}

    {errors.submit && <div>{errors.submit}</div>}

    <FormActions>
      <div>
        No account? <FormLink to={'/signup'}>Sign Up</FormLink>
      </div>

      <div>
        <PrimaryButton
          type={'submit'}
          // disabled={isSubmitting || !isValid}
        >
          Sign in
        </PrimaryButton>
      </div>
    </FormActions>
  </CenteredForm>
)
