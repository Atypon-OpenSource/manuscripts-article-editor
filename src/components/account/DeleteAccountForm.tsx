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

import { Project } from '@manuscripts/manuscripts-json-schema'
import { DangerSubmitButton } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { FormError, FormErrors } from '../Form'
import { ModalFormActions } from '../ModalForm'
import { TextField } from '../TextField'
import { TextFieldContainer } from '../TextFieldContainer'

export interface DeleteAccountValues {
  password: string
}

interface DeleteAccountProps {
  deletedProjects: Project[]
}

const MessageContainer = styled.div`
  font-family: Barlow;
  font-size: 16px;
  color: ${props => props.theme.colors.global.text.secondary};
  margin-top: 15px;
  margin-left: 20px;
`

export const DeleteAccountForm: React.FunctionComponent<
  FormikProps<DeleteAccountValues & FormErrors> & DeleteAccountProps
> = ({ deletedProjects, errors, isSubmitting }) => (
  <Form id={'delete-account-form'} noValidate={true}>
    <Field name={'password'}>
      {({ field }: FieldProps) => (
        <TextFieldContainer error={errors.password}>
          <TextField
            {...field}
            type={'password'}
            placeholder={'Confirm your password to delete your account'}
            autoFocus={true}
            required={true}
          />
        </TextFieldContainer>
      )}
    </Field>
    {errors.submit && <FormError>{errors.submit}</FormError>}
    {deletedProjects &&
      deletedProjects.length !== 0 && (
        <MessageContainer>
          {'Deleting your account will also delete these projects'}
          <ul>
            {deletedProjects.map(project => (
              <li key={project._id}>
                <Title value={project.title || 'Untitled Project'} />
              </li>
            ))}
          </ul>
        </MessageContainer>
      )}
    <ModalFormActions>
      <DangerSubmitButton disabled={isSubmitting}>
        Delete Account
      </DangerSubmitButton>
    </ModalFormActions>
  </Form>
)
