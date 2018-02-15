import * as React from 'react'

import { FormikErrors, FormikProps } from 'formik'
import { styled } from '../theme'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader, FormLink } from './Form'
import { Hero, SubHero } from './Hero'
import { FirstTextField, LastTextField } from './TextField'

export interface LoginValues {
  email: string
  password: string
}

export interface LoginErrors extends FormikErrors<LoginValues> {
  submit: string
}

const ManuscriptLinks = styled.div`
  text-align: left;
`

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

    <FirstTextField
      type={'email'}
      name={'email'}
      placeholder={'email'}
      autoFocus={true}
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
      <ManuscriptLinks>
        <div>
          No account? <FormLink to={'/signup'}>Sign Up</FormLink>
        </div>
        <div>
          Forgot password? <FormLink to={'/recover'}>Reset</FormLink>
        </div>
      </ManuscriptLinks>

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
