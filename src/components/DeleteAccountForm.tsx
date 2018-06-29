import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from './Button'
import { buildError, FormError, FormErrors } from './Form'
import { ModalFormActions } from './ModalForm'
import { TextField } from './TextField'
import { TextFieldContainer } from './TextFieldContainer'

export interface DeleteAccountValues {
  password: string
}

export const DeleteAccountForm: React.SFC<
  FormikProps<DeleteAccountValues & FormErrors>
> = ({ dirty, errors, touched }) => (
  <Form>
    <Field name={'password'}>
      {({ field }: FieldProps) => (
        <TextFieldContainer
          error={buildError(
            dirty,
            touched.password as boolean,
            errors.password as string
          )}
        >
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
      <PrimaryButton type={'submit'}>Delete Account</PrimaryButton>
    </ModalFormActions>
  </Form>
)
