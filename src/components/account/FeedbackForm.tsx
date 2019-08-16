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
