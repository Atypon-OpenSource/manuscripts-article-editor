import { FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
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
import { TextField, TextFieldLabel } from './TextField'

export interface CollaboratorValues {
  name: string
  surname: string
}

export interface CollaboratorErrors extends FormikErrors<CollaboratorValues> {
  submit?: string
}

export interface CollaboratorFormProps {
  stopEditing: () => void
  deleteCollaborator: () => void
}

export const CollaboratorForm = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
  stopEditing,
  deleteCollaborator,
}: FormikProps<CollaboratorValues & CollaboratorErrors> &
  CollaboratorFormProps) => (
  <form onSubmit={handleSubmit}>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>Collaborators / {values.name} / Manage</ModalHeading>
      </ModalHeader>
      <ModalForm>
        <ModalFormBody>
          <ModalMain>
            <FormGroup>
              <TextFieldLabel>
                Collaborator Name
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
                Collaborator Surname
                <TextField
                  type={'text'}
                  name={'surname'}
                  id={'surname'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.surname}
                />
              </TextFieldLabel>
            </FormGroup>

            {errors.submit && <div>{errors.submit}</div>}
          </ModalMain>
        </ModalFormBody>

        <ModalFormFooter>
          <ModalFormFooterText>
            <ModalFooterButton onClick={deleteCollaborator}>
              Delete Collaborator
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
