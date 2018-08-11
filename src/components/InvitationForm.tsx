import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { manuscriptsBlue } from '../colors'
import { styled } from '../theme'
import { PrimaryButton } from './Button'
import { Control, Main, RadioButton, TextHint } from './ShareProjectPopper'
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
> = ({ errors, isSubmitting }) => (
  <Main>
    <Form>
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
            />
          )}
        </Field>
      </TextFieldGroupContainer>
      <RadioButtonsContainer>
        <Control>
          <Field name={'role'}>
            {({ field }: FieldProps) => (
              <input
                {...field}
                type={'radio'}
                value={'Owner'}
                required={true}
              />
            )}
          </Field>
          <RadioButton />
          Owner
          <TextHint>
            Can modify and delete project, invite
            <br />
            and remove contributors
          </TextHint>
        </Control>
        <Control>
          <Field name={'role'}>
            {({ field }: FieldProps) => (
              <input
                {...field}
                type={'radio'}
                value={'Writer'}
                required={true}
              />
            )}
          </Field>
          <RadioButton />
          Writer
          <TextHint>Can modify project contents</TextHint>
        </Control>
        <Control>
          <Field name={'role'}>
            {({ field }: FieldProps) => (
              <input
                {...field}
                type={'radio'}
                value={'Viewer'}
                required={true}
              />
            )}
          </Field>
          <RadioButton />
          Viewer
          <TextHint>
            Can only review projects without
            <br />
            modifying it
          </TextHint>
        </Control>
      </RadioButtonsContainer>
      <SendInvitationButton type={'submit'} disabled={isSubmitting}>
        Send Invitation
      </SendInvitationButton>
    </Form>
  </Main>
)
