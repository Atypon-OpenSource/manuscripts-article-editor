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

import { PrimarySubmitButton } from '@manuscripts/style-guide'
import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { FormError, FormErrors } from '../Form'
import { ModalFormActions } from '../ModalForm'
import { TextField } from '../TextField'
import { TextFieldGroupContainer } from '../TextFieldGroupContainer'

export interface ChangePasswordValues {
  currentPassword: string
  newPassword: string
}

export const ChangePasswordForm: React.FunctionComponent<
  FormikProps<ChangePasswordValues & FormErrors>
> = ({ errors, isSubmitting }) => (
  <Form id={'change-password-form'} noValidate={true}>
    <TextFieldGroupContainer
      errors={{
        currentPassword: errors.currentPassword,
        newPassword: errors.newPassword,
      }}
    >
      <Field name={'currentPassword'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'password'}
            placeholder={'Enter the current password'}
            autoComplete={'password'}
            autoFocus={true}
            required={true}
            error={errors.currentPassword}
          />
        )}
      </Field>
      <Field name={'newPassword'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'password'}
            autoComplete={'new-password'}
            placeholder={'Enter a new password'}
            required={true}
            error={errors.newPassword}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    {errors.submit && <FormError>{errors.submit}</FormError>}

    <ModalFormActions>
      <PrimarySubmitButton disabled={isSubmitting}>Save</PrimarySubmitButton>
    </ModalFormActions>
  </Form>
)
