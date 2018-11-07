import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { manuscriptsBlue } from '../../colors'
import { ProjectRole } from '../../lib/roles'
import { styled } from '../../theme'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { PrimaryButton } from '../Button'
import { FormError } from '../Form'
import { RadioButton } from '../RadioButton'
import { TextField } from '../TextField'
import { TextFieldGroupContainer } from '../TextFieldGroupContainer'

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
  // disabled?: boolean
}

interface Props {
  dismissSentAlert?: () => void
  disabled?: boolean
}

export interface InvitationErrors {
  submit?: string
}

type InvitationFormProps = FormikProps<InvitationValues & InvitationErrors> &
  Props

export const InvitationForm: React.SFC<InvitationFormProps> = ({
  errors,
  dismissSentAlert,
  disabled,
  isSubmitting,
  values,
}) => (
  <Form noValidate={true}>
    {errors.submit && (
      <AlertMessage type={AlertMessageType.error} hideCloseButton={true}>
        {errors.submit}{' '}
      </AlertMessage>
    )}
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
            onFocus={dismissSentAlert!}
            type={'text'}
            placeholder={'name'}
            required={true}
            error={errors.name}
            disabled={disabled}
          />
        )}
      </Field>

      <Field name={'email'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            onFocus={dismissSentAlert!}
            type={'email'}
            placeholder={'email'}
            required={true}
            error={errors.email}
            disabled={disabled}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    <RadioButtonsContainer>
      <Field name={'role'}>
        {({ field }: FieldProps) => (
          <RadioButton
            {...field}
            onFocus={dismissSentAlert!}
            value={'Owner'}
            required={true}
            textHint={
              'Can modify and delete project, invite and remove collaborators'
            }
            checked={values.role === ProjectRole.owner}
            disabled={disabled}
          >
            Owner
          </RadioButton>
        )}
      </Field>

      <Field name={'role'}>
        {({ field }: FieldProps) => (
          <RadioButton
            {...field}
            onFocus={dismissSentAlert!}
            value={'Writer'}
            required={true}
            textHint={'Can modify project contents'}
            checked={values.role === ProjectRole.writer}
            disabled={disabled}
          >
            Writer
          </RadioButton>
        )}
      </Field>

      <Field name={'role'}>
        {({ field }: FieldProps) => (
          <RadioButton
            {...field}
            onFocus={dismissSentAlert!}
            value={'Viewer'}
            required={true}
            textHint={'Can only review projects without modifying it'}
            checked={values.role === ProjectRole.viewer}
            disabled={disabled}
          >
            Viewer
          </RadioButton>
        )}
      </Field>

      {errors.role && <FormError>{errors.role}</FormError>}
    </RadioButtonsContainer>

    <SendInvitationButton type={'submit'} disabled={isSubmitting || disabled}>
      Send Invitation
    </SendInvitationButton>
  </Form>
)
