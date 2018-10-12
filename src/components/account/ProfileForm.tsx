import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { BibliographicName } from '../../types/components'
import { PrimaryButton } from '../Button'
import { FormError } from '../Form'
import { ModalFormActions } from '../ModalForm'
import { TextField } from '../TextField'
import { TextFieldGroupContainer } from '../TextFieldGroupContainer'

export interface ProfileValues {
  bibliographicName: BibliographicName
  phone?: string
}

export interface ProfileErrors {
  submit?: object
}

export const ProfileForm: React.SFC<
  FormikProps<ProfileValues & ProfileErrors>
> = ({ values, errors, isSubmitting }) => (
  <Form noValidate={true}>
    <TextFieldGroupContainer
      errors={{
        bibliographicNameFamily: errors.bibliographicName
          ? errors.bibliographicName.family
          : undefined,
        bibliographicNameGiven: errors.bibliographicName
          ? errors.bibliographicName.given
          : undefined,
      }}
    >
      <Field name={'bibliographicName.given'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'text'}
            placeholder={'given name'}
            autoComplete={'given-name'}
            autoFocus={true}
          />
        )}
      </Field>

      <Field name={'bibliographicName.family'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'text'}
            placeholder={'family name'}
            autoComplete={'family-name'}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    {errors.submit && <FormError>{errors.submit}</FormError>}

    <ModalFormActions>
      <PrimaryButton type={'submit'} disabled={isSubmitting}>
        Save
      </PrimaryButton>
    </ModalFormActions>
  </Form>
)
