/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  CenteredForm,
  FormActions,
  FormError,
  FormHeader,
  PrimarySubmitButton,
  TextField,
  TextFieldGroupContainer,
} from '@manuscripts/style-guide'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { FormLink } from '../Form'
import { Hero, SubHero } from '../Hero'

export interface SignupValues {
  name: string
  email: string
  password: string
  allowsTracking: boolean
}

export interface SignupErrors {
  submit?: string
}

export const SignupForm: React.FunctionComponent<
  FormikProps<SignupValues & SignupErrors>
> = ({ errors, isSubmitting, initialValues }) => (
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

    <FormActions>
      <Field name={'allowsTracking'}>
        {({ field }: FieldProps) => (
          <label>
            <input {...field} type={'checkbox'} />
            Allow tracking usage to help improve service.
          </label>
        )}
      </Field>
    </FormActions>

    {errors.submit && (
      <FormError className="form-error">{errors.submit}</FormError>
    )}

    <FormActions>
      <div>
        Have an account? <FormLink to={'/login'}>Sign In</FormLink>
      </div>

      <PrimarySubmitButton disabled={isSubmitting}>Sign up</PrimarySubmitButton>
    </FormActions>
  </CenteredForm>
)
