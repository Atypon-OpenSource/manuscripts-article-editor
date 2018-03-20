import { FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { styled } from '../theme'
import { PrimaryButton } from './Button'
import { CenteredForm, FormActions, FormHeader, FormLink } from './Form'
import { Hero, SubHero } from './Hero'
import { TextField, TextFieldGroup } from './TextField'

export interface LoginValues {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  syncSession: string
  user: {
    id: string
    email: string
    name: string
  }
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
  dirty,
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

    <TextFieldGroup>
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

      <TextField
        type={'password'}
        name={'password'}
        placeholder={'password'}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
        required={true}
        autoComplete={'current-password'}
      />
    </TextFieldGroup>

    {dirty && touched.email && errors.email && <div>{errors.email}</div>}
    {dirty &&
      touched.password &&
      errors.password && <div>{errors.password}</div>}

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
