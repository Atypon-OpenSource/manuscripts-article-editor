import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikErrors,
  FormikProps,
} from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { manuscriptsBlue } from '../../colors'
import { ProjectRole } from '../../lib/roles'
import { styled } from '../../theme'
import { projectInvitationSchema } from '../../validation'
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

const AlertMessageContainer = styled.div`
  margin-bottom: 9px;
`

export interface InvitationValues {
  name: string
  email: string
  role: string
}

interface Props {
  allowSubmit: boolean
  invitationValues?: InvitationValues
  handleSubmit: (values: InvitationValues) => Promise<void>
}

interface State {
  invitationSent: boolean
}

export interface InvitationErrors {
  submit?: string
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
    const { allowSubmit, invitationValues } = this.props

    const { invitationSent } = this.state

    return (
      <Formik
        onSubmit={this.handleSubmit}
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

            <SendInvitationButton
              type={'submit'}
              disabled={isSubmitting || !allowSubmit}
            >
              Send Invitation
            </SendInvitationButton>
          </Form>
        )}
      </Formik>
    )
  }

  private dismissSuccessAlert = () => this.setState({ invitationSent: false })

  private handleSubmit = async (
    values: InvitationValues,
    actions: FormikActions<InvitationValues | InvitationErrors>
  ) => {
    try {
      await this.props.handleSubmit(values)
      this.setState({ invitationSent: true })
    } catch (error) {
      const errors: FormikErrors<InvitationErrors> = {}

      if (error.response) {
        errors.submit = this.errorResponseMessage(error.response.status)
      }

      actions.setErrors(errors)
    } finally {
      actions.setSubmitting(false)
    }
  }

  private errorResponseMessage = (status: number) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'You are already a collaborator on this project.'

      case HttpStatusCodes.CONFLICT:
        return 'The invited user is already a collaborator on this project.'
      default:
        return 'Sending invitation failed.'
    }
  }
}
