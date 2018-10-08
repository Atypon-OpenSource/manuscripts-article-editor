import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { manuscriptsBlue } from '../colors'
import { styled } from '../theme'
import { PrimaryButton } from './Button'
import { FormError } from './Form'
import { RadioButton } from './RadioButton'
import { TextField } from './TextField'
import { TextFieldGroupContainer } from './TextFieldGroupContainer'

const SendInvitationButton = styled(PrimaryButton)`
  background-color: ${manuscriptsBlue};
  width: 100%;

  &:hover {
    border-color: ${manuscriptsBlue};
    color: ${manuscriptsBlue};
  }

  &:active {
    background-color: ${manuscriptsBlue};
    border-color: white;
    color: white;
  }

  &:hover:disabled {
    border-color: ${manuscriptsBlue};
    color: white;
    background-color: ${manuscriptsBlue};
    cursor: unset;
  }
`

const RadioButtonsContainer = styled.div`
  padding-top: 24px;
  padding-bottom: 24px;
`

export interface InvitationValues {
  name: string
  email: string
  role: string
}

export interface InvitationErrors {
  submit?: string
}

export const InvitationForm: React.SFC<
  FormikProps<InvitationValues & InvitationErrors>
> = ({ errors, isSubmitting, initialValues }) => (
  <Form noValidate={true}>
    <TextFieldGroupContainer
      errors={{
        name: errors.name,
        email: errors.email,
      }}
    >
      <Field name={'name'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'text'}
            placeholder={'name'}
            required={true}
            error={errors.name}
            disabled={!initialValues.name}
          />
        )}
      </Field>

      <Field name={'email'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'email'}
            placeholder={'email'}
            required={true}
            error={errors.email}
            disabled={!initialValues.email}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    <RadioButtonsContainer>
      <Field name={'role'}>
        {({ field }: FieldProps) => (
          <RadioButton
            {...field}
            value={'Owner'}
            required={true}
            textHint={
              'Can modify and delete project, invite and remove collaborators'
            }
            disabled={!initialValues.role}
          >
            Owner
          </RadioButton>
        )}
      </Field>

      <Field name={'role'}>
        {({ field }: FieldProps) => (
          <RadioButton
            {...field}
            value={'Writer'}
            required={true}
            textHint={'Can modify project contents'}
            disabled={!initialValues.role}
          >
            Writer
          </RadioButton>
        )}
      </Field>

      <Field name={'role'}>
        {({ field }: FieldProps) => (
          <RadioButton
            {...field}
            value={'Viewer'}
            required={true}
            textHint={'Can only review projects without modifying it'}
            disabled={!initialValues.role}
          >
            Viewer
          </RadioButton>
        )}
      </Field>

      {errors.role && <FormError>{errors.role}</FormError>}
    </RadioButtonsContainer>

    <SendInvitationButton type={'submit'} disabled={isSubmitting}>
      Send Invitation
    </SendInvitationButton>
  </Form>
)
