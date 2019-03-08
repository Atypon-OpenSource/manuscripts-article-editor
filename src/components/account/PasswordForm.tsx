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
  FormHeader,
  PrimarySubmitButton,
  TextField,
  TextFieldContainer,
} from '@manuscripts/style-guide'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { SubHero } from '../Hero'
import { ModalFormActions } from '../ModalForm'

export interface PasswordValues {
  password: string
}

export interface PasswordErrors {
  submit?: string
  unauthorized?: string
}

export const PasswordForm: React.FunctionComponent<
  FormikProps<PasswordValues & PasswordErrors>
> = ({ errors, isSubmitting }) => (
  <CenteredForm noValidate={true}>
    <FormHeader>
      <SubHero>Choose a new password</SubHero>
    </FormHeader>

    <Field name={'password'}>
      {({ field }: FieldProps) => (
        <TextFieldContainer error={errors.password}>
          <TextField
            {...field}
            type={'password'}
            autoFocus={true}
            required={true}
            autoComplete={'new-password'}
          />
        </TextFieldContainer>
      )}
    </Field>

    {errors.submit && <div>{errors.submit}</div>}

    <ModalFormActions>
      <PrimarySubmitButton disabled={isSubmitting}>
        Save Password
      </PrimarySubmitButton>
    </ModalFormActions>
  </CenteredForm>
)
