/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  FormError,
  PrimaryButton,
  TextField,
  TextFieldGroupContainer,
} from '@manuscripts/style-guide'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikErrors,
  FormikProps,
} from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { ProjectRole } from '../../lib/roles'
import { styled } from '../../theme/styled-components'
import { projectInvitationSchema } from '../../validation'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { RadioButton } from '../RadioButton'

const SendInvitationButton = styled(PrimaryButton).attrs({
  type: 'submit',
})`
  width: 100%;
`

const RadioButtonsContainer = styled.div`
  padding-top: 24px;
  padding-bottom: 24px;
`

const AlertMessageContainer = styled.div`
  margin-bottom: 9px;
`

const errorResponseMessage = (status: number) => {
  switch (status) {
    case HttpStatusCodes.BAD_REQUEST:
      return 'You are already a collaborator on this project.'

    case HttpStatusCodes.CONFLICT:
      return 'The invited user is already a collaborator on this project.'
    default:
      return 'Sending invitation failed.'
  }
}

export interface InvitationValues {
  name: string
  email: string
  role: string
}

interface InvitationErrors {
  submit?: string
}

interface Props {
  allowSubmit: boolean
  invitationValues?: InvitationValues
  handleSubmit: (values: InvitationValues) => Promise<void>
}

interface State {
  invitationSent: boolean
}

export class InvitationForm extends React.Component<Props, State> {
  public state = {
    invitationSent: false,
  }

  private initialValues: InvitationValues = {
    email: '',
    name: '',
    role: 'Writer',
  }

  public render() {
    const { allowSubmit, handleSubmit, invitationValues } = this.props

    const { invitationSent } = this.state

    return (
      <Formik<InvitationValues>
        onSubmit={async (values, actions) => {
          try {
            await handleSubmit(values)
            this.setState({ invitationSent: true })
          } catch (error) {
            const errors: FormikErrors<InvitationValues & InvitationErrors> = {}

            errors.submit = error.response
              ? errorResponseMessage(error.response.status)
              : 'There was an error submitting the form.'

            actions.setErrors(errors)
          } finally {
            actions.setSubmitting(false)
          }
        }}
        initialValues={invitationValues || this.initialValues}
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={projectInvitationSchema}
      >
        {({
          errors,
          isSubmitting,
          values,
          resetForm,
        }: FormikProps<InvitationValues & InvitationErrors>) => (
          <Form noValidate={true}>
            {errors.submit && (
              <AlertMessage
                type={AlertMessageType.error}
                hideCloseButton={true}
              >
                {errors.submit}{' '}
              </AlertMessage>
            )}
            {!allowSubmit && (
              <AlertMessageContainer>
                <AlertMessage
                  type={AlertMessageType.info}
                  hideCloseButton={true}
                >
                  Only project owners can invite others to the project.
                </AlertMessage>
              </AlertMessageContainer>
            )}
            {invitationSent && (
              <AlertMessageContainer>
                <AlertMessage
                  type={AlertMessageType.success}
                  hideCloseButton={true}
                  dismissButton={{
                    text: 'OK',
                    action: () => {
                      this.dismissSuccessAlert()
                      resetForm(this.initialValues)
                    },
                  }}
                >
                  Invitation was sent successfully.
                </AlertMessage>
              </AlertMessageContainer>
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
                    onFocus={this.dismissSuccessAlert}
                    type={'text'}
                    placeholder={'name'}
                    required={true}
                    error={errors.name}
                    disabled={!allowSubmit}
                  />
                )}
              </Field>

              <Field name={'email'}>
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    onFocus={this.dismissSuccessAlert}
                    type={'email'}
                    placeholder={'email'}
                    required={true}
                    error={errors.email}
                    disabled={!allowSubmit}
                  />
                )}
              </Field>
            </TextFieldGroupContainer>

            <RadioButtonsContainer>
              <Field name={'role'}>
                {({ field }: FieldProps) => (
                  <RadioButton
                    {...field}
                    onFocus={this.dismissSuccessAlert}
                    value={'Owner'}
                    required={true}
                    textHint={
                      'Can modify and delete project, invite and remove collaborators'
                    }
                    checked={values.role === ProjectRole.owner}
                    disabled={!allowSubmit}
                  >
                    Owner
                  </RadioButton>
                )}
              </Field>

              <Field name={'role'}>
                {({ field }: FieldProps) => (
                  <RadioButton
                    {...field}
                    onFocus={this.dismissSuccessAlert}
                    value={'Writer'}
                    required={true}
                    textHint={'Can modify project contents'}
                    checked={values.role === ProjectRole.writer}
                    disabled={!allowSubmit}
                  >
                    Writer
                  </RadioButton>
                )}
              </Field>

              <Field name={'role'}>
                {({ field }: FieldProps) => (
                  <RadioButton
                    {...field}
                    onFocus={this.dismissSuccessAlert}
                    value={'Viewer'}
                    required={true}
                    textHint={'Can only review projects without modifying it'}
                    checked={values.role === ProjectRole.viewer}
                    disabled={!allowSubmit}
                  >
                    Viewer
                  </RadioButton>
                )}
              </Field>

              {errors.role && <FormError>{errors.role}</FormError>}
            </RadioButtonsContainer>

            <SendInvitationButton disabled={isSubmitting || !allowSubmit}>
              Send Invitation
            </SendInvitationButton>
          </Form>
        )}
      </Formik>
    )
  }

  private dismissSuccessAlert = () => {
    this.setState({
      invitationSent: false,
    })
  }
}
