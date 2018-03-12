import { FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
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
import { TextField, TextFieldGroup } from './TextField'

export interface AccountValues {
  givenName: string
  familyName: string
  phone: string
}

export interface AccountErrors extends FormikErrors<AccountValues> {
  submit?: string
}

export const AccountForm = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
}: FormikProps<AccountValues & AccountErrors>) => (
  <form onSubmit={handleSubmit}>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>Manage Account</ModalHeading>
      </ModalHeader>
      <ModalForm>
        <ModalFormBody>
          <ModalMain>
            <TextFieldGroup>
              <TextField
                type={'text'}
                name={'givenName'}
                placeholder={'Given Name'}
                autoFocus={true}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.givenName}
                required={true}
              />

              <TextField
                type={'text'}
                name={'familyName'}
                placeholder={'Family Name'}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.familyName}
                required={true}
              />
            </TextFieldGroup>

            <TextField
              type={'text'}
              name={'phone'}
              placeholder={'contact phone'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
              required={true}
            />

            {errors.submit && <div>{errors.submit}</div>}
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
  </form>
)
