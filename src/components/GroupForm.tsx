import { FormikErrors, FormikProps } from 'formik'
import React from 'react'
import { FormGroup } from './Form'
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
import { TextArea, TextField, TextFieldLabel } from './TextField'

export interface GroupValues {
  name: string
  description: string
}

export interface GroupErrors extends FormikErrors<GroupValues> {
  submit?: string | null
}

export interface GroupFormProps {
  stopEditing: () => void
  deleteGroup: () => void
}

export const GroupForm = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
  stopEditing,
  deleteGroup,
}: FormikProps<GroupValues & GroupErrors> & GroupFormProps) => (
  <form onSubmit={handleSubmit}>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>Groups / {values.name} / Manage</ModalHeading>
      </ModalHeader>
      <ModalForm>
        <ModalFormBody>
          <ModalMain>
            <FormGroup>
              <TextFieldLabel>
                Group Name
                <TextField
                  type={'text'}
                  name={'name'}
                  id={'name'}
                  autoFocus={true}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  required={true}
                />
              </TextFieldLabel>
            </FormGroup>

            <FormGroup>
              <TextFieldLabel>
                Group Description
                <TextArea
                  name={'description'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                />
              </TextFieldLabel>
            </FormGroup>

            {errors.submit && <div>{errors.submit}</div>}
          </ModalMain>
        </ModalFormBody>

        <ModalFormFooter>
          <ModalFormFooterText>
            <ModalFooterButton onClick={deleteGroup}>
              Delete Group
            </ModalFooterButton>
          </ModalFormFooterText>

          <ModalFormActions>
            <ModalFooterButton onClick={stopEditing}>Cancel</ModalFooterButton>

            <PrimaryModalFooterButton type={'submit'}>
              Done
            </PrimaryModalFooterButton>
          </ModalFormActions>
        </ModalFormFooter>
      </ModalForm>
    </ModalContainer>
  </form>
)
