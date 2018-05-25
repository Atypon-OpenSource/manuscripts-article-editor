import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { BibliographicName } from '../types/components'
import { buildError, FormError } from './Form'
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
import { ManageAccountMessage } from './Messages'
import { TextField } from './TextField'
import { TextFieldContainer } from './TextFieldContainer'
import { TextFieldGroupContainer } from './TextFieldGroupContainer'

export interface ProfileValues {
  bibliographicName: BibliographicName
  phone?: string
}

export interface ProfileErrors {
  submit?: object
}

export const ProfileForm: React.SFC<
  FormikProps<ProfileValues & ProfileErrors>
> = ({ values, dirty, touched, errors }) => (
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
            <TextFieldGroupContainer
              errors={{
                bibliographicName: buildError(
                  dirty,
                  touched.bibliographicName as boolean,
                  errors.bibliographicName as string
                ),
              }}
            >
              <Field name={'bibliographicName.given'}>
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    type={'text'}
                    placeholder={'given name'}
                    autoComplete={'given-name'}
                    autoFocus={true}
                  />
                )}
              </Field>

              <Field name={'bibliographicName.family'}>
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    type={'text'}
                    placeholder={'family name'}
                    autoComplete={'family-name'}
                  />
                )}
              </Field>
            </TextFieldGroupContainer>

            <TextFieldContainer>
              <TextField
                type={'text'}
                name={'phone'}
                placeholder={'contact phone'}
                autoComplete={'tel'}
                required={true}
              />
            </TextFieldContainer>

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
