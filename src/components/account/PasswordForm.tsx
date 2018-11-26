import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { PrimaryButton } from '../Button'
import { CenteredForm, FormHeader } from '../Form'
import { SubHero } from '../Hero'
import { ModalFormActions } from '../ModalForm'
import { TextField } from '../TextField'
import { TextFieldContainer } from '../TextFieldContainer'

export interface PasswordValues {
  password: string
}

export interface PasswordErrors {
  submit?: string
  unauthorized?: string
}

export const PasswordForm: React.FunctionComponent<
  FormikProps<PasswordValues & PasswordErrors>
> = ({ errors, isSubmitting }) => (
  <CenteredForm noValidate={true}>
    <FormHeader>
      <SubHero>Choose a new password</SubHero>
    </FormHeader>

    <Field name={'password'}>
      {({ field }: FieldProps) => (
        <TextFieldContainer error={errors.password}>
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
      <PrimaryButton type={'submit'} disabled={isSubmitting}>
        Save Password
      </PrimaryButton>
    </ModalFormActions>
  </CenteredForm>
)
