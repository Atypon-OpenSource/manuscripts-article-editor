import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'
import { styled, ThemedProps } from '../../theme'
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
import { ErrorName } from './LoginPageContainer'

type ThemedLinkProps = ThemedProps<Link>

export interface LoginValues {
  email: string
  password: string
}

const ManuscriptLinks = styled.div`
  text-align: left;
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const RecoverLink = styled(Link)`
  text-decoration: underline;
  color: ${(props: ThemedLinkProps) => props.theme.colors.global.text.error};
`

interface Props {
  submitErrorType: string | null
}

export const LoginForm: React.FunctionComponent<
  FormikProps<LoginValues & FormErrors> & Props
> = ({ errors, isSubmitting, submitErrorType }) => (
  <CenteredForm id={'login-form'} noValidate={true}>
    <FormHeader>
      <SubHero>Welcome to</SubHero>
      <Hero>Manuscripts.io</Hero>
    </FormHeader>

    {errors.submit && (
      <FormError>
        <Container>
          {errors.submit}
          {submitErrorType === ErrorName.AccountNotFoundError && (
            <RecoverLink to={'/signup'}>Sign up</RecoverLink>
          )}
          {submitErrorType === ErrorName.InvalidCredentialsError && (
            <RecoverLink to={'/recover'}>Forgot password?</RecoverLink>
          )}
        </Container>
      </FormError>
    )}

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
          Forgot password? <FormLink to={'/recover'}>Reset Password</FormLink>
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
