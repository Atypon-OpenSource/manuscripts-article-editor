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
  PrimarySubmitButton,
  TextField,
  TextFieldGroupContainer,
} from '@manuscripts/style-guide'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '../../theme/styled-components'
import { SubHero } from '../Hero'

export interface RecoverValues {
  email: string
}

export interface RecoverErrors {
  notFound: string
  submit: string
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const SignupLink = styled(Link)`
  text-decoration: underline;
  color: ${props => props.theme.colors.global.text.error};
`

export const RecoverForm: React.FunctionComponent<
  FormikProps<RecoverValues & RecoverErrors>
> = ({ errors, isSubmitting }) => (
  <CenteredForm noValidate={true}>
    <FormHeader>
      <SubHero>Reset Password</SubHero>
    </FormHeader>
    <TextFieldGroupContainer
      errors={{
        name: errors.email,
      }}
    >
      <Field name={'email'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'email'}
            placeholder={'email'}
            autoFocus={true}
            required={true}
            autoComplete={'username email'}
            error={errors.email as string}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    {/*{touched.email && errors.email && <div>{errors.email}</div>}*/}

    {errors.notFound && (
      <FormError className="form-error">
        <Container>
          Email address not found.
          <SignupLink to={'/signup'}>Sign up?</SignupLink>
        </Container>
      </FormError>
    )}

    {errors.submit && <div>{errors.submit}</div>}

    <FormActions>
      <div />
      <div>
        <PrimarySubmitButton disabled={isSubmitting}>
          Send password reset
        </PrimarySubmitButton>
      </div>
    </FormActions>
  </CenteredForm>
)
