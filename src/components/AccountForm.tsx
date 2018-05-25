import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { buildError, FormError, FormErrors } from './Form'
import {
  ModalContainer,
  ModalFooterButton,
  ModalForm,
  ModalFormActions,
  ModalFormBody,
  ModalFormFooter,
  ModalFormFooterText,
  ModalHeader,
  ModalHeading,
  ModalMain,
  PrimaryModalFooterButton,
} from './Manage'
import { ManageAccountMessage } from './Messages'
import { TextField } from './TextField'
import { TextFieldContainer } from './TextFieldContainer'

export interface AccountValues {
  password: string
}

// TODO
export interface UpdateAccountResponse {
  status?: number
}

// TODO: link to "delete account" page

export const AccountForm: React.SFC<
  FormikProps<AccountValues & FormErrors>
> = ({ dirty, errors, touched }) => (
  <Form>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>
          <ManageAccountMessage />
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
                    placeholder={'Enter a new password'}
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
          <ModalFormFooterText>
            <ModalFooterButton>Delete Account</ModalFooterButton>
          </ModalFormFooterText>

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
