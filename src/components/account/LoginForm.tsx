/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  CenteredForm,
  FormActions,
  FormError,
  FormErrors,
  FormHeader,
  PrimaryButton,
  TextField,
  TextFieldGroupContainer,
} from '@manuscripts/style-guide'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FormLink } from '../Form'
import { Hero, SubHero } from '../Hero'
import { ErrorName } from './LoginPageContainer'

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
  color: ${props => props.theme.colors.text.error};
`

const HeavyLink = styled.a`
  font-weight: ${props => props.theme.font.weight.medium};
  color: inherit;
`

interface Props {
  submitErrorType?: string
}

export const LoginForm: React.FunctionComponent<FormikProps<
  LoginValues & FormErrors
> &
  Props> = ({ errors, isSubmitting, submitErrorType }) => (
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

    <div>
      By signing in you agree to our{' '}
      <HeavyLink href={'https://www.atypon.com/privacy-policy/'}>
        Privacy policy
      </HeavyLink>
      .
    </div>

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
        <PrimaryButton type="submit" disabled={isSubmitting}>
          Sign in
        </PrimaryButton>
      </div>
    </FormActions>
  </CenteredForm>
)
