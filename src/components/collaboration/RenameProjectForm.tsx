import { PrimarySubmitButton } from '@manuscripts/style-guide'
import { TitleField } from '@manuscripts/title-editor'
import { Form, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { FormError, FormErrors } from '../Form'
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
