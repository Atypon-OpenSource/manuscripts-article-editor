import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { buildError, FormError, FormErrors } from './Form'
import {
  ModalContainer,
  ModalForm,
  ModalFormActions,
  ModalFormBody,
  ModalFormFooter,
  ModalHeader,
  ModalHeading,
  ModalMain,
  PrimaryModalFooterButton,
} from './Manage'
import { ChangePasswordMessage } from './Messages'
import { TextField } from './TextField'
import { TextFieldGroupContainer } from './TextFieldGroupContainer'

export interface ChangePasswordValues {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  status?: number
}

export const ChangePasswordForm: React.SFC<
  FormikProps<ChangePasswordValues & FormErrors>
> = ({ dirty, errors, touched }) => (
  <Form>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>
          <ChangePasswordMessage />
        </ModalHeading>
      </ModalHeader>
      <ModalForm>
        <ModalFormBody>
          <ModalMain>
            <TextFieldGroupContainer
              errors={{
                currentPassword: buildError(
                  dirty,
                  touched.currentPassword as boolean,
                  errors.currentPassword as string
                ),
                newPassword: buildError(
                  dirty,
                  touched.newPassword as boolean,
                  errors.newPassword as string
                ),
              }}
            >
              <Field name={'currentPassword'}>
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    type={'password'}
                    placeholder={'Enter the current password'}
                    autoFocus={true}
                    required={true}
                    error={errors.currentPassword as string}
                  />
                )}
              </Field>
              <Field name={'newPassword'}>
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    type={'password'}
                    placeholder={'Enter a new password'}
                    autoFocus={true}
                    required={true}
                    error={errors.newPassword as string}
                  />
                )}
              </Field>
            </TextFieldGroupContainer>
            {errors.submit && <FormError>{errors.submit}</FormError>}
          </ModalMain>
        </ModalFormBody>

        <ModalFormFooter>
          <ModalFormActions>
            <PrimaryModalFooterButton type={'submit'}>
              Done
            </PrimaryModalFooterButton>
          </ModalFormActions>
        </ModalFormFooter>
      </ModalForm>
    </ModalContainer>
  </Form>
)
