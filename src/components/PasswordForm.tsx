import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from './Button'
import { buildError, CenteredForm, FormHeader } from './Form'
import { SubHero } from './Hero'
import { ModalFormActions } from './ModalForm'
import { TextField } from './TextField'
import { TextFieldContainer } from './TextFieldContainer'

export interface PasswordValues {
  password: string
}

export interface PasswordHiddenValues {
  token: string
}

export interface ResetPasswordResponse {
  token: string
}

export interface PasswordErrors {
  submit?: string
  unauthorized?: string
}

export const PasswordForm: React.SFC<
  FormikProps<PasswordValues & PasswordErrors>
> = ({
  dirty,
  errors,
  touched,
  // isSubmitting,
  // isValid,
}) => (
  <CenteredForm>
    <FormHeader>
      <SubHero>Choose a new password</SubHero>
    </FormHeader>

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
            autoFocus={true}
            required={true}
            autoComplete={'new-password'}
          />
        </TextFieldContainer>
      )}
    </Field>

    {errors.submit && <div>{errors.submit}</div>}

    <ModalFormActions>
      <PrimaryButton
        type={'submit'}
        // disabled={isSubmitting || !isValid}
      >
        Save Password
      </PrimaryButton>
    </ModalFormActions>
  </CenteredForm>
)
