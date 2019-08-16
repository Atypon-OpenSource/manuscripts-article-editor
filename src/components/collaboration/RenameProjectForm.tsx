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
} from '@manuscripts/style-guide'
import { TitleField } from '@manuscripts/title-editor'
import { Form, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ModalFormActions } from '../ModalForm'

const StyledTitleField = styled(TitleField)`
  font-size: 20px;

  & .ProseMirror {
    &:focus {
      outline: none;
    }

    &.empty-node::before {
      position: absolute;
      color: #ccc;
      cursor: text;
      content: 'Untitled Project';
      pointer-events: none;
    }

    &.empty-node:hover::before {
      color: #949494;
    }
  }
`
export interface RenameProjectValues {
  title: string
}

export const RenameProjectForm: React.FunctionComponent<
  FormikProps<RenameProjectValues & FormErrors>
> = ({ errors, isSubmitting, values, setFieldValue }) => (
  <Form noValidate={true}>
    <StyledTitleField
      value={values.title || ''}
      handleChange={(data: string) => setFieldValue('title', data)}
      autoFocus={true}
    />

    {errors.submit && <FormError>{errors.submit}</FormError>}

    <ModalFormActions>
      <PrimarySubmitButton disabled={isSubmitting}>Rename</PrimarySubmitButton>
    </ModalFormActions>
  </Form>
)
