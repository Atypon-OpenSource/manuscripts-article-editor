import { TitleField } from '@manuscripts/title-editor'
import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { dustyGrey } from '../../colors'
import { styled } from '../../theme'
import { PrimaryButton } from '../Button'
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
      color: ${dustyGrey};
    }
  }
`
export interface Values {
  projectTitle: string | undefined
}

export const RenameProjectForm: React.FunctionComponent<
  FormikProps<Values & FormErrors>
> = ({ errors, isSubmitting, values }) => (
  <Form id={'rename-project-form'} noValidate={true}>
    <Field name={'Title'}>
      {(field: FieldProps) => (
        <StyledTitleField
          id={'project-title-field'}
          value={values.projectTitle}
          handleChange={(data: string) =>
            field.form.setFieldValue('projectTitle', data)
          }
          autoFocus={true}
        />
      )}
    </Field>

    {errors.submit && <FormError>{errors.submit}</FormError>}

    <ModalFormActions>
      <PrimaryButton type={'submit'} disabled={isSubmitting}>
        Rename
      </PrimaryButton>
    </ModalFormActions>
  </Form>
)
