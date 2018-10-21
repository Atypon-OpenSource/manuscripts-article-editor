import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme'
import { PrimaryButton } from '../Button'
import {
  CenteredForm,
  FormActions,
  FormError,
  FormErrors,
  FormHeader,
  FormLink,
} from '../Form'
import { Hero, SubHero } from '../Hero'
import { TextField } from '../TextField'
import { TextFieldGroupContainer } from '../TextFieldGroupContainer'

export interface LoginValues {
  email: string
  password: string
}

const ManuscriptLinks = styled.div`
  text-align: left;
`
export const LoginForm: React.SFC<FormikProps<LoginValues & FormErrors>> = ({
  errors,
  isSubmitting,
}) => (
  <CenteredForm id={'login-form'} noValidate={true}>
    <FormHeader>
      <SubHero>Welcome to</SubHero>
      <Hero>Manuscripts.io</Hero>
    </FormHeader>

    {errors.submit && <FormError>{errors.submit}</FormError>}

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
            error={errors.email}
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
            autoComplete={'password'}
            error={errors.password}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    <FormActions>
      <ManuscriptLinks>
        <div>
          No account? <FormLink to={'/signup'}>Sign up</FormLink>
        </div>
        <div>
          Forgot password? <FormLink to={'/recover'}>Reset</FormLink>
        </div>
      </ManuscriptLinks>

      <div>
        <PrimaryButton type={'submit'} disabled={isSubmitting}>
          Sign in
        </PrimaryButton>
      </div>
    </FormActions>
  </CenteredForm>
)
