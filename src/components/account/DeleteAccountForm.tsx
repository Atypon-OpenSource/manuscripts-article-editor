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

import { Project } from '@manuscripts/manuscripts-json-schema'
import {
  DangerSubmitButton,
  FormError,
  FormErrors,
  TextField,
  TextFieldContainer,
} from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ModalFormActions } from '../ModalForm'

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
    {deletedProjects && deletedProjects.length !== 0 && (
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
