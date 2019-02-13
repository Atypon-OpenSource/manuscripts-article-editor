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
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { CenteredForm, FormActions, FormHeader } from '../Form'
import { SubHero } from '../Hero'
import { TextField } from '../TextField'

export interface RecoverValues {
  email: string
}

export interface RecoverErrors {
  notFound: string
  submit: string
}

export const RecoverForm: React.FunctionComponent<
  FormikProps<RecoverValues & RecoverErrors>
> = ({ values, errors, isSubmitting }) => (
  <CenteredForm noValidate={true}>
    <FormHeader>
      <SubHero>Reset Password</SubHero>
    </FormHeader>

    <Field name={'email'}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          type={'email'}
          placeholder={'email'}
          autoFocus={true}
          required={true}
          autoComplete={'username email'}
        />
      )}
    </Field>

    {/*{touched.email && errors.email && <div>{errors.email}</div>}*/}

    {errors.notFound && <div>Email address not found</div>}

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
