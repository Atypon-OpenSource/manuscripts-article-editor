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
  FormHeader,
  PrimaryButton,
  TextField,
  TextFieldGroupContainer,
} from '@manuscripts/style-guide'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import styled from 'styled-components'
import { FormLink } from '../Form'
import { Hero, SubHero } from '../Hero'

export interface SignupValues {
  name: string
  email: string
  password: string
}

export interface SignupErrors {
  submit?: string
}

const HeavyLink = styled.a`
  font-weight: ${props => props.theme.font.weight.medium};
  color: inherit;
`

export const SignupForm: React.FunctionComponent<
  FormikProps<SignupValues & SignupErrors>
> = ({ errors, isSubmitting }) => (
  <CenteredForm id={'signup-form'} noValidate={true}>
    <FormHeader>
      <SubHero>Manuscripts.io</SubHero>
      <Hero>Sign Up</Hero>
    </FormHeader>

    <TextFieldGroupContainer
      errors={{
        name: errors.name,
      }}
    >
      <Field name={'name'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'text'}
            placeholder={'name'}
            required={true}
            autoComplete={'name'}
            error={errors.name as string}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

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
            autoComplete={'new-password'}
            error={errors.password as string}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    {errors.submit && (
      <FormError className="form-error">{errors.submit}</FormError>
    )}

    <div>
      By signing up you agree to our{' '}
      <HeavyLink href={'https://www.atypon.com/privacy-policy/'}>
        Privacy policy
      </HeavyLink>
      .<br />
    </div>

    <FormActions>
      <div>
        Have an account? <FormLink to={'/login'}>Sign In</FormLink>
      </div>

      <PrimaryButton type="submit" disabled={isSubmitting}>
        Sign up
      </PrimaryButton>
    </FormActions>
  </CenteredForm>
)
