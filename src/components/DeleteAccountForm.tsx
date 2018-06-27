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
import { DeleteAccountMessage } from './Messages'
import { TextField } from './TextField'
import { TextFieldContainer } from './TextFieldContainer'

export interface AccountValues {
  password: string
}

export interface UpdateAccountResponse {
  status?: number
}

export const DeleteAccountForm: React.SFC<
  FormikProps<AccountValues & FormErrors>
> = ({ dirty, errors, touched }) => (
  <Form>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>
          <DeleteAccountMessage />
        </ModalHeading>
      </ModalHeader>
      <ModalForm>
        <ModalFormBody>
          <ModalMain>
            <Field name={'password'}>
              {({ field }: FieldProps) => (
                <TextFieldContainer
                  label={'Password'}
                  error={buildError(
                    dirty,
                    touched.password as boolean,
                    errors.password as string
                  )}
                >
                  <TextField
                    {...field}
                    type={'password'}
                    placeholder={'Confirm your password to delete'}
                    autoFocus={true}
                    required={true}
                  />
                </TextFieldContainer>
              )}
            </Field>

            {errors.submit && <FormError>{errors.submit}</FormError>}
          </ModalMain>
        </ModalFormBody>

        <ModalFormFooter>
          <ModalFormActions>
            <PrimaryModalFooterButton type={'submit'}>
              Delete Account
            </PrimaryModalFooterButton>
          </ModalFormActions>
        </ModalFormFooter>
      </ModalForm>
    </ModalContainer>
  </Form>
)
