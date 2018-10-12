import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from '../Button'
import { FormError, FormErrors } from '../Form'
import { ModalFormActions } from '../ModalForm'
import { TextField } from '../TextField'
import { TextFieldContainer } from '../TextFieldContainer'

export interface DeleteAccountValues {
  password: string
}

export const DeleteAccountForm: React.SFC<
  FormikProps<DeleteAccountValues & FormErrors>
> = ({ errors, isSubmitting }) => (
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

    <ModalFormActions>
      <PrimaryButton type={'submit'} disabled={isSubmitting}>
        Delete Account
      </PrimaryButton>
    </ModalFormActions>
  </Form>
)
