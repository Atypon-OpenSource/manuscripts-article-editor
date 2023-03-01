/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  AlertMessage,
  AlertMessageType,
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
import { StatusCodes } from 'http-status-codes'
import React from 'react'
import styled from 'styled-components'

import { ProjectRole } from '../../lib/roles'
import { TokenActions } from '../../store'
import { RadioButton } from '../RadioButton'

const SendInvitationButton = styled(PrimaryButton)`
  width: 100%;
`

const RadioButtonsContainer = styled.div`
  padding-top: ${(props) => props.theme.grid.unit * 6}px;
  padding-bottom: ${(props) => props.theme.grid.unit * 6}px;
`

const AlertMessageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`

const errorResponseMessage = (status: number) => {
  switch (status) {
    case StatusCodes.BAD_REQUEST:
      return 'You are already a collaborator on this project.'

    case StatusCodes.CONFLICT:
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
  tokenActions: TokenActions
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
    const { allowSubmit, handleSubmit, invitationValues, tokenActions } =
      this.props

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

            if (
              error.response &&
              error.response.status === StatusCodes.UNAUTHORIZED
            ) {
              tokenActions.delete()
            } else {
              actions.setErrors(errors)
            }
          } finally {
            actions.setSubmitting(false)
          }
        }}
        initialValues={invitationValues || this.initialValues}
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
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
                      resetForm()
                    },
                  }}
                >
                  Invitation was sent.
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
                    _id={'owner'}
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
                    _id={'writer'}
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
                    _id={'viewer'}
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

            <SendInvitationButton
              type="submit"
              disabled={isSubmitting || !allowSubmit}
            >
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
