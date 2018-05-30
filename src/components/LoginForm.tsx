import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../theme'
import { PrimaryButton } from './Button'
import {
  buildError,
  CenteredForm,
  FormActions,
  FormError,
  FormErrors,
  FormHeader,
  FormLink,
} from './Form'
import { Hero, SubHero } from './Hero'
import { TextField } from './TextField'
import { TextFieldGroupContainer } from './TextFieldGroupContainer'

export interface LoginValues {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

const ManuscriptLinks = styled.div`
  text-align: left;
`
export const LoginForm: React.SFC<FormikProps<LoginValues & FormErrors>> = ({
  dirty,
  errors,
  touched,
  // isSubmitting,
  // isValid,
}) => (
  <CenteredForm>
    <FormHeader>
      <SubHero>Welcome to</SubHero>
      <Hero>Manuscripts Online</Hero>
    </FormHeader>

    {errors.submit && <FormError>{errors.submit}</FormError>}

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
            autoComplete={'username email'}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

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
