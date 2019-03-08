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
