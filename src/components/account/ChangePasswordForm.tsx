import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { PrimarySubmitButton } from '../Button'
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
