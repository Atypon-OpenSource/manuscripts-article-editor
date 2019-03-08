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
  FormError,
  FormErrors,
  PrimarySubmitButton,
  TextArea,
  TextField,
  TextFieldContainer,
  TextFieldGroupContainer,
} from '@manuscripts/style-guide'
import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ModalFormActions } from '../ModalForm'

export interface FeedbackValues {
  message: string
  title: string
}

const Container = styled.div`
  margin-top: 10px;
  color: ${props => props.theme.colors.global.text.secondary};
`

export const FeedbackForm: React.FunctionComponent<
  FormikProps<FeedbackValues & FormErrors>
> = ({ errors, isSubmitting }) => (
  <Form id={'feedback-form'} noValidate={true}>
    <TextFieldGroupContainer errors={{ title: errors.title }}>
      <Field name={'title'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'title'}
            placeholder={'Title'}
            autoFocus={true}
            required={true}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    <TextFieldContainer error={errors.message}>
      <Field name={'message'}>
        {({ field }: FieldProps) => (
          <TextArea
            {...field}
            placeholder={
              'Please tell us how you like Manuscripts.io, and what we should improve.\n\nIf you are reporting a bug, please include steps to help us reproduce the problem you encountered.'
            }
            autoFocus={true}
            required={true}
          />
        )}
      </Field>
    </TextFieldContainer>

    <Container>
      <label>Your feedback will be posted privately to the developers.</label>
    </Container>

    {errors.submit && <FormError>{errors.submit}</FormError>}

    <ModalFormActions>
      <PrimarySubmitButton disabled={isSubmitting}>Submit</PrimarySubmitButton>
    </ModalFormActions>
  </Form>
)
